# CampusConnect Frontend (Vite + React)

This is the frontend for CampusConnect built with Vite, React, Tailwind CSS, and React Router.

## Quick start

```bash
cd frontend-campusconnect
npm install
npm run dev
```

## Environment

Create a `.env` file at the project root with:

```env
VITE_API_BASE=http://localhost:8080
```

This URL should point to your backend server.

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Deployment notes

- This site is ready for static hosting. Vercel or Netlify are good options.
- Set `VITE_API_BASE` in production to your backend endpoint.
- Ensure the backend supports CORS from the frontend domain.

## Features

- JWT authentication
- Protected routes
- Profile photo and cover upload with progress
- Discovery pagination and like/skip actions
- Matches list with chat integration
- Dark/light theme toggle
- Error boundary and 404 page
- Responsive UI with skeleton loaders
