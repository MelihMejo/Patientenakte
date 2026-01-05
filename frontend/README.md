# Patient Records Frontend

## Setup
1. `npm install`
2. Copy `.env.example` -> `.env` (optional)
3. `npm run dev`

This frontend assumes the backend runs on http://localhost:5000.
In development, Vite proxies `/api` to the backend.

## Pages
- `/` Home: create patient, search, add/remove from list, click listed to open record
- `/patients/:patientId` Record: edit patient, CRUD entries
