# Intervexa

Intervexa is an AI-based interview practice platform inspired by the shared synopsis. It includes a React frontend, a Node.js + Express backend, MongoDB persistence, JWT authentication, voice-to-voice interviews, streak tracking, history, and activity charts.

## Features

- Subject-wise mock interviews for DSA, Operating Systems, Computer Networks, and DBMS
- Groq-powered voice interviews with speech-to-text and text-to-speech
- Weighted scoring with 3 easy, 4 medium, and 3 hard questions totaling 20 marks
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
GROQ_API_KEY=
GROQ_CHAT_MODEL=llama-3.3-70b-versatile
GROQ_TRANSCRIPTION_MODEL=whisper-large-v3-turbo
GROQ_TTS_MODEL=canopylabs/orpheus-v1-english
GROQ_TTS_VOICE=hannah
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
- `POST /api/interviews/:id/answer`
- `GET /api/interviews/history`
- `GET /api/dashboard/overview`

## Notes

- If `GROQ_API_KEY` is missing, voice transcription and speech generation will not work.
- The backend expects MongoDB to be running locally unless you point `MONGODB_URI` to Atlas or another instance.
