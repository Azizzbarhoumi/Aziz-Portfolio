# Ahmed Aziz Barhoumi — Portfolio

Personal portfolio built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, and Lenis. Portfolio pages are statically generated; the assistant uses a server-side API route.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Build and deploy

Set `NEXT_PUBLIC_SITE_URL` to the deployed site’s canonical HTTPS origin. Copy `.env.example` to `.env.local` and replace the example values. Keep both provider keys only in server-side environment settings.

```bash
npm run lint
npm run build
```

Deploy the Next.js project to Vercel or another host that supports Next.js route handlers. The portfolio assistant uses `/api/chat`; this requires a server runtime and is not compatible with static export. Set `NEXT_PUBLIC_SITE_URL`, `QWEN_API_KEY`, and `GEMINI_API_KEY` in the host's environment settings. Keep keys server-side and never prefix them with `NEXT_PUBLIC_`. Qwen generates chat answers; Gemini embeddings are used only to search the approved portfolio text. `QWEN_MODEL` is optional and defaults to `qwen3.8-flash`.

The portfolio assistant splits `knowledge/aziz.md` into heading-aware chunks, embeds each chunk with Gemini's `gemini-embedding-001`, and retrieves the closest passages by cosine similarity for each question. Qwen receives only the retrieved passages and writes the answer. The generated `knowledge/aziz.vectors.json` index is versioned by a hash of the knowledge file; after editing facts, rebuild it with `npm run index:knowledge`. Deploy the generated index with the app. If the index is absent or stale, the server regenerates it on demand using `EMBEDDING_PROVIDER` and `EMBEDDING_MODEL`. The approved knowledge file is the chatbot's single source of truth; project page content in `data/projects.ts` is not used by the chatbot. Keep personal facts in the knowledge file current and never add the phone number.

Run `npm run index:knowledge` to regenerate the chunk and embedding index after editing the knowledge file; it requires `GEMINI_API_KEY` and usable embedding quota. To use a different provider/model, set `EMBEDDING_PROVIDER` and `EMBEDDING_MODEL`.
Run `npm run eval:chat` to check the live retrieval and Qwen response pipeline; it requires both provider keys and usable embedding quota.
Run `npm run test:chat` for local offline checks of chunking, vector retrieval, prompt grounding, history handling, and markdown rendering.

## Update portfolio content

- Edit project copy, tags, role/context, year, and links in [`data/projects.ts`](./data/projects.ts).
- Edit the assistant's approved facts in [`knowledge/aziz.md`](./knowledge/aziz.md). Do not add private contact details that should not appear in chat.
- Replace `public/images/ahmed-aziz-portrait.webp` to update the grayscale portrait. Keep the path or update the `Image` source in `app/page.tsx`.
- The CV download is `public/Ahmed-Aziz-Barhoumi-CV.pdf`.

The sitemap and canonical metadata use `NEXT_PUBLIC_SITE_URL`; set it to the real domain before deploying so search engines don’t see the example fallback URL.
