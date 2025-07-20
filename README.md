# Adryter Backend (MERN)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and update values if needed:
   ```bash
   cp .env.example .env
   ```
3. Start MongoDB locally (or update MONGODB_URI in .env for remote DB).

## Running the Server

- For development (with auto-reload):
  ```bash
  npm run dev
  ```
- For production:
  ```bash
  npm start
  ```

## Health Check

Visit [http://localhost:5000/api/health](http://localhost:5000/api/health) to verify the backend is running. 