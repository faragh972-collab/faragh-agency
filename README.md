# Faragh Agency

React/Vite frontend with an Express API, MongoDB persistence, secure stateless admin sessions, Gemini content generation, and direct Vercel Blob media uploads.

## Local development

Requirements: Node.js 20+ and a MongoDB database.

1. Copy `.env.example` to `.env.local`.
2. Replace every placeholder with a real value.
3. Install dependencies with `npm install`.
4. Start the project with `npm run dev`.

The app runs at `http://localhost:3000`. Open `#admin`, use `?admin=true`, or press `Ctrl+Shift+A` to open the owner login.

## Deploy to Vercel from GitHub

1. Push the repository to GitHub. Never commit `.env` or `.env.local`.
2. Import the GitHub repository into Vercel.
3. Create a MongoDB Atlas database and add its connection string as `MONGODB_URI`.
4. In the Vercel project, open Storage, create/connect a public Blob store, and allow Vercel to add `BLOB_READ_WRITE_TOKEN`.
5. Add these Environment Variables for Production and Preview:

   - `ADMIN_PASSWORD`: a long, unique owner password.
   - `ADMIN_SESSION_SECRET`: an independent random secret of at least 64 characters.
   - `MONGODB_URI`: the MongoDB Atlas connection string.
   - `GEMINI_API_KEY`: required only for AI content generation.
   - `GEMINI_MODEL`: optional; defaults to `gemini-2.5-flash`.

6. Deploy. The first successful request to `/api/content` seeds MongoDB with `src/initialData.ts` when no content document exists.

Vercel uses `vercel.json` to build the Vite frontend into `dist`. API requests are handled by `api/[...path].ts`, which exports the Express application as a Vercel Function.

## Checks

```bash
npm run lint
npm run build
```

After deployment verify:

- `/api/health` returns `status: "ok"` and `databaseConfigured: true`.
- The homepage loads its content.
- Wrong admin credentials return `401`.
- The owner can save a content change and it remains after a redeployment.
- An image uploaded from the dashboard returns a `*.blob.vercel-storage.com` URL.
