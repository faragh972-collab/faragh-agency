import 'dotenv/config';
import crypto from 'crypto';
import express from 'express';
import mongoose from 'mongoose';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { z } from 'zod';
import { GoogleGenAI } from '@google/genai';
import { initialSiteData } from './src/initialData.js';
import type { SiteData } from './src/types.js';

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '4mb' }));

const siteDataSchema = z.object({
  agencyInfo: z.object({ name: z.string().max(200) }).passthrough(),
  hero: z.object({ mainTitle: z.string().max(500) }).passthrough(),
  aboutCards: z.array(z.unknown()).max(100),
  services: z.array(z.unknown()).max(100),
  stats: z.array(z.unknown()).max(100),
  portfolio: z.array(z.unknown()).max(200),
  whyUsSection: z.object({}).passthrough().optional(),
  team: z.array(z.unknown()).max(100),
  seoSettings: z.object({ metaTitle: z.string().max(300) }).passthrough(),
}).passthrough();

const contentSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true, versionKey: false });

const SiteContent: mongoose.Model<any> = mongoose.models.SiteContent
  || mongoose.model('SiteContent', contentSchema);

let connectionPromise: Promise<typeof mongoose> | null = null;
async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not configured');
  if (mongoose.connection.readyState === 1) return mongoose;
  connectionPromise ??= mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 5,
  }).catch((error) => {
    connectionPromise = null;
    throw error;
  });
  return connectionPromise;
}

async function getSiteData(): Promise<SiteData> {
  await connectDatabase();
  const content = await SiteContent.findOneAndUpdate(
    { key: 'site' },
    { $setOnInsert: { data: initialSiteData } },
    { new: true, upsert: true, lean: true },
  );
  return content!.data as SiteData;
}

async function saveSiteData(data: SiteData) {
  await connectDatabase();
  await SiteContent.updateOne(
    { key: 'site' },
    { $set: { data } },
    { upsert: true },
  );
}

const parseCookies = (header = '') => Object.fromEntries(
  header.split(';').map((part) => {
    const separator = part.indexOf('=');
    if (separator < 0) return ['', ''];
    return [decodeURIComponent(part.slice(0, separator).trim()), decodeURIComponent(part.slice(separator + 1))];
  }).filter(([key]) => key),
);

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || '';
}

function createSessionToken() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + 8 * 60 * 60 * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', sessionSecret()).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function isAdmin(req: express.Request) {
  const token = parseCookies(req.headers.cookie).faragh_admin_session;
  const secret = sessionSecret();
  if (!token || !secret) return false;
  const [payload, suppliedSignature] = token.split('.');
  if (!payload || !suppliedSignature) return false;
  const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  const expected = Buffer.from(expectedSignature);
  const supplied = Buffer.from(suppliedSignature);
  if (expected.length !== supplied.length || !crypto.timingSafeEqual(expected, supplied)) return false;
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { exp?: number };
    return typeof parsed.exp === 'number' && parsed.exp > Date.now();
  } catch {
    return false;
  }
}

const requireAdmin: express.RequestHandler = (req, res, next) => {
  if (!isAdmin(req)) return res.status(401).json({ success: false, error: 'غير مصرح' });
  next();
};

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', agency: 'Faragh Agency', databaseConfigured: Boolean(process.env.MONGODB_URI) });
});

app.get('/api/admin-session', (req, res) => {
  res.json({ success: true, authenticated: isAdmin(req) });
});

app.post('/api/admin-login', (req, res) => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || !sessionSecret()) {
    return res.status(503).json({ success: false, error: 'لم يتم إعداد بيانات الإدارة على الخادم' });
  }

  const key = req.ip || 'unknown';
  const now = Date.now();
  const attempt = loginAttempts.get(key);
  if (attempt && attempt.resetAt > now && attempt.count >= 5) {
    return res.status(429).json({ success: false, error: 'محاولات كثيرة. حاول لاحقًا.' });
  }

  const supplied = typeof req.body?.password === 'string' ? req.body.password : '';
  const expectedBuffer = Buffer.from(adminPassword);
  const suppliedBuffer = Buffer.from(supplied);
  const valid = expectedBuffer.length === suppliedBuffer.length
    && crypto.timingSafeEqual(expectedBuffer, suppliedBuffer);

  if (!valid) {
    const current = attempt && attempt.resetAt > now ? attempt : { count: 0, resetAt: now + 15 * 60 * 1000 };
    current.count += 1;
    loginAttempts.set(key, current);
    return res.status(401).json({ success: false, error: 'كلمة المرور غير صحيحة' });
  }

  loginAttempts.delete(key);
  const token = createSessionToken();
  const secure = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  res.setHeader('Set-Cookie', `faragh_admin_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${secure ? '; Secure' : ''}`);
  res.json({ success: true });
});

app.post('/api/admin-logout', (req, res) => {
  res.setHeader('Set-Cookie', 'faragh_admin_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');
  res.json({ success: true });
});

app.get('/api/content', async (_req, res) => {
  try {
    res.json({ success: true, data: await getSiteData() });
  } catch (error) {
    console.error('Failed to get content:', error);
    res.status(503).json({ success: false, error: 'تعذر الاتصال بقاعدة البيانات' });
  }
});

app.post('/api/content', requireAdmin, async (req, res) => {
  try {
    const result = siteDataSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, error: 'بيانات الموقع غير صالحة', details: result.error.flatten() });
    }
    if (JSON.stringify(result.data).includes('data:')) {
      return res.status(400).json({ success: false, error: 'يجب رفع الملفات إلى التخزين بدلًا من حفظ Base64' });
    }
    const data = result.data as unknown as SiteData;
    await saveSiteData(data);
    res.json({ success: true, message: 'تم حفظ التغييرات بنجاح', data });
  } catch (error) {
    console.error('Failed to save content:', error);
    res.status(503).json({ success: false, error: 'تعذر حفظ البيانات في قاعدة البيانات' });
  }
});

app.post('/api/upload', async (req, res) => {
  try {
    const response = await handleUpload({
      body: req.body as HandleUploadBody,
      request: req,
      onBeforeGenerateToken: async () => {
        if (!isAdmin(req)) throw new Error('غير مصرح برفع الملفات');
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'],
          maximumSizeInBytes: 100 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => undefined,
    });
    res.json(response);
  } catch (error) {
    res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'فشل رفع الملف' });
  }
});

app.post('/api/ai-generate', requireAdmin, async (req, res) => {
  const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
  if (!prompt || prompt.length > 5000) {
    return res.status(400).json({ success: false, error: 'النص المطلوب غير صالح' });
  }
  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({ success: false, error: 'مفتاح Gemini API غير معرف' });
  }
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `أنت مساعد تسويقي محترف لوكالة Faragh Agency. اكتب محتوى عربيًا واضحًا واحترافيًا. سياق الطلب: ${String(req.body?.context || 'إنشاء محتوى تسويقي').slice(0, 1000)}.`,
      },
    });
    res.json({ success: true, text: response.text });
  } catch (error) {
    console.error('AI generation error:', error);
    res.status(502).json({ success: false, error: 'تعذر توليد المحتوى حاليًا' });
  }
});

export default app;
