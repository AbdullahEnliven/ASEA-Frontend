# ASEA Frontend

React + Vite frontend for the ASEA AI Store Builder platform.

---

## Tech Stack

- **React 18** · **Vite** · **Tailwind CSS**
- **Zustand** for state management
- **Socket.IO Client** for real-time preview updates
- **Monaco Editor** for in-app code viewing
- **Axios** for API requests

---

## First-Time Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file in the `Frontend/` directory:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

For production, point this to your Railway backend URL.

### 3. Start the development server

```bash
npm run dev
```

App runs at **http://localhost:5173**

---

## Build for Production

```bash
npm run build
```

Output goes to `dist/`. Deploy the `dist/` folder to Vercel, Netlify, or any static host.

---

## Project Structure

```
Frontend/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts
│   ├── components/      # Shared UI components
│   ├── pages/           # Page-level components (BuilderPage, Dashboard…)
│   ├── services/        # Axios API service modules
│   ├── store/           # Zustand global state stores
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Helper functions
│   ├── App.jsx          # Root component + routing
│   └── main.jsx         # Entry point
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Key Pages

| Route | Description |
|---|---|
| `/` | Landing / login |
| `/dashboard` | Project list |
| `/builder/:id` | AI store builder (Preview · Code · Chat) |
| `/onboarding` | New user setup flow |
