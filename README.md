# Intervexa

Intervexa is an AI-based interview practice platform inspired by the shared synopsis. It includes a React frontend, a Node.js + Express backend, MongoDB persistence, JWT authentication, interview scoring, streak tracking, history, and activity charts.

## Features

- Subject-wise mock interviews for DSA, Operating Systems, and Computer Networks
- AI-assisted question generation and answer evaluation
- Fallback interview mode when no AI key is configured
- Weighted scoring normalized to 20 marks
- Practice streaks and recent activity tracking
- Interview history and dashboard analytics

## Project structure

- `client` React + Vite frontend
- `server` Node.js + Express + MongoDB backend

## Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/intervexa
JWT_SECRET=change-me
CLIENT_URL=http://localhost:5173
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
```

3. Start backend:

```bash
npm run dev:server
```

4. Start frontend:

```bash
npm run dev:client
```

## API overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/interviews/start`
- `POST /api/interviews/:id/submit`
- `GET /api/interviews/history`
- `GET /api/dashboard/overview`

## Notes

- If `OPENAI_API_KEY` is missing, the app uses curated fallback questions and rule-based evaluation.
- The backend expects MongoDB to be running locally unless you point `MONGODB_URI` to Atlas or another instance.
