# Resumind 📄🤖

Resumind is a browser-based AI resume analyzer. It lets an authenticated Puter user upload a PDF resume, optionally provide a target company, job title, and job description, and receive structured feedback about ATS compatibility, tone and style, content, structure, and skills.

The application uses Puter as its platform for authentication, file storage, key-value storage, and AI requests. There is no application-owned API server or database in this repository.

## Features ✨

- 🔐 Puter authentication with sign-in and sign-out
- 📤 PDF resume upload with a 20 MB file-size limit
- 🖼️ First-page resume preview generated in the browser with `pdfjs-dist`
- 🧠 AI-generated resume feedback through Puter AI
- 📊 Overall, ATS, tone and style, content, structure, and skills scores
- 💡 ATS suggestions and expandable detailed recommendations
- ☁️ Resume files stored in Puter File System and resume metadata stored in Puter KV
- 📑 Resume detail view with a PDF preview that can be opened in a new browser tab
- ⚡ Vite-powered development server with React Router and HMR
- 🎨 Tailwind CSS styling with custom application components

## How It Works 🔄

1. 🌐 The app loads the Puter JavaScript SDK from `https://js.puter.com/v2/`.
2. 🔐 The user signs in with Puter. Protected pages redirect unauthenticated users to `/auth`.
3. 📤 The user uploads a PDF and enters optional job context on `/upload`.
4. 🖼️ The original PDF is uploaded to Puter File System. The first PDF page is rendered to a PNG in the browser and that image is uploaded as well.
5. 🗃️ A resume record is written to Puter KV under a `resume:<uuid>` key. The record contains the Puter file paths, job information, and analysis feedback.
6. 🤖 Puter AI analyzes the uploaded resume using the configured `google/gemini-3.7-flash` model which can be updated in the `app/lib/puter.ts` file and the JSON format defined in `app/constants/index.ts`.
7. 📊 The feedback is saved back to Puter KV and displayed on the resume detail page.

## Technologies 🛠️

- ⚛️ React 19 and React DOM
- 🧭 React Router 8 with Vite
- 🔷 TypeScript with strict compiler settings
- 🧠 Zustand for the Puter client store and application state
- ☁️ Puter JavaScript SDK for auth, file storage, KV storage, and AI
- 📄 `pdfjs-dist` for client-side PDF rendering
- 🖱️ `react-dropzone` for PDF selection and drag-and-drop upload
- 🎨 Tailwind CSS 4, `@tailwindcss/vite`, and `tw-animate-css`
- 🟢 Node.js and npm

## Project Structure 🗂️

```text
app/
├── components/       Shared UI for navigation, upload, cards, scores, ATS, and details
├── constants/        AI feedback schema and prompt construction
├── lib/
│   ├── pdf2img.ts    Client-side first-page PDF-to-PNG conversion
│   ├── puter.ts      Zustand store wrapping the Puter SDK
│   └── utils.ts      Class-name, file-size, and UUID utilities
├── routes/           Home, auth, upload, resume detail, and data-wipe routes
├── app.css           Tailwind theme and application styles
├── root.tsx          Puter SDK loading and application shell
└── routes.ts         React Router route definitions
public/
├── icons/            UI icons
├── images/           Backgrounds, previews, and loading illustrations
└── pdf.worker.min.mjs PDF.js worker used for local PDF rendering
types/
├── index.d.ts        Resume and AI feedback data shapes
└── puter.d.ts        Puter SDK-related type declarations
```

## Routes 🧭

| Route | Purpose |
| --- | --- |
| `/` | Lists the signed-in user's saved resume analyses |
| `/auth` | Signs in or signs out through Puter |
| `/upload` | Accepts a PDF and starts resume analysis |
| `/resume/:id` | Shows the saved resume preview and structured feedback |
| `/wipe` | Destructively deletes the user's Puter files and flushes KV data |

⚠️ The `/wipe` route is a cleanup utility for the current Puter account. Use it carefully because it deletes files and key-value records.

## Getting Started 🚀

### Requirements ✅

- 🟢 Node.js compatible with the repository's dependencies (the Dockerfile uses Node 24)
- 📦 npm
- 👤 A Puter account and browser access to Puter services

Puter is loaded at runtime from its public JavaScript SDK URL. No Puter API key or `.env` file is configured by this project. Authentication and storage are associated with the signed-in Puter account.

### Installation 📥

Install the dependencies:

```bash
npm install
```

### Development 💻

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

Open the local URL, sign in, choose **Upload Resume**, select a PDF no larger than 20 MB, and submit it with any available job details. Analysis requires network access to Puter services and may be affected by Puter account limits or service availability.

### Type Checking 🔍

Generate React Router route types and run the TypeScript compiler:

```bash
npm run typecheck
```

## Building for Production 🏗️

Create a production build:

```bash
npm run build
```

The build output is generated in `build/`. The project can be served with:

```bash
npm run start
```

## Deployment 🚢

### Docker Deployment 🐳

```bash
docker build -t ai-resume-analyzer .

# Run the container
docker run -p 3000:3000 ai-resume-analyzer
```

The containerized app can be deployed to a platform that supports Docker, such as:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- DigitalOcean App Platform
- Fly.io
- Railway

### DIY Deployment ⚙️

The production serving command is:

```bash
npm run start
```

Make sure to deploy the output of `npm run build`:

```text
├── package.json
├── package-lock.json
└── build/
	├── client/    # Static assets
	└── server/    # Server-side serving output
```

The repository configures React Router with `ssr: false`, so the application is built as a client-side application while still using the React Router production serving workflow. A deployed site must be able to load the Puter SDK and reach Puter services from the user's browser.

## Data and Privacy Notes 🔒

- 📄 Uploaded PDF files and generated preview images are stored in the signed-in user's Puter File System.
- 🗃️ Resume metadata and the AI feedback JSON are stored in the signed-in user's Puter KV store.
- 🤖 The AI request sends the uploaded resume path and job context to Puter AI.
- ℹ️ This repository does not define retention, encryption, or export policies beyond the behavior provided by Puter.
- 🧹 The `/wipe` route calls Puter file deletion and KV flush operations for cleanup.

## Development Notes 📝

- 🧪 There are currently no automated test scripts in `package.json`; use `npm run typecheck` and `npm run build` as the available project checks.
- 📄 The first page of a PDF is used for the image preview. The original PDF remains available from the resume detail page.
- ⚠️ The generated AI response is expected to be JSON matching the `Feedback` interface. Malformed or incomplete AI output may prevent the feedback view from rendering correctly.

## Styling 🎨

The interface uses [Tailwind CSS](https://tailwindcss.com/) 4 with custom theme colors, gradients, responsive layouts, and reusable classes defined in `app/app.css`. The project also uses the Mona Sans web font from Google Fonts.

---

Built with ❤️ using React, React Router, Tailwind CSS, and Puter.
