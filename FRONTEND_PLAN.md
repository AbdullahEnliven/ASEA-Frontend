# ASEA Platform — Frontend Development Plan
### AI-Powered E-Commerce Store Builder | React.js + Tailwind CSS

---

## Overview

The ASEA frontend is the primary interface through which users describe, generate, preview, edit, and deploy their e-commerce stores. It is inspired by tools like Lovable and Webflow — but purpose-built for e-commerce store generation only.

The frontend communicates with the FastAPI backend for all generation logic, authentication, and project management. Once a store is generated, users can connect their Supabase project and push to GitHub directly from the interface.

**Stack:** React.js (no TypeScript), Tailwind CSS, Vite, Zustand, TanStack Query, React Hook Form + Zod, Monaco Editor, Socket.IO client.

---

## Technology Stack

| Category | Technology | Purpose |
|---|---|---|
| Framework | React.js (JavaScript only) | Core UI framework |
| Build Tool | Vite | Fast dev server and bundling |
| Styling | Tailwind CSS | Utility-first styling |
| State Management | Zustand | Global client state |
| Server State | TanStack Query (React Query) | API data fetching, caching, background sync |
| Forms | React Hook Form + Zod | Form handling and validation |
| Routing | React Router v6 | Client-side routing |
| Real-time | Socket.IO client | Live generation progress stream |
| Code Preview | Monaco Editor | Read-only and editable code viewer |
| Rich Text | Tiptap | Inline text editing in live preview |
| Animations | Framer Motion | Page transitions and UI animations |
| Notifications | React Hot Toast | Non-blocking toast notifications |
| Icons | Lucide React | Consistent icon system |
| Charts | Recharts | Analytics dashboards |
| HTTP Client | Axios | API communication with interceptors |
| Auth Storage | Zustand + localStorage | Persist JWT tokens |

---

## Application Structure

```
src/
├── assets/                  # Static images, fonts, SVGs
├── components/
│   ├── common/              # Button, Input, Modal, Badge, Spinner, etc.
│   ├── layout/              # AppShell, Sidebar, Navbar, Footer
│   ├── auth/                # Login form, Register form, OAuth buttons
│   ├── dashboard/           # Project cards, stats, activity feed
│   ├── builder/             # Core builder UI components
│   │   ├── RequirementInput/
│   │   ├── SpecificationReview/
│   │   ├── GenerationProgress/
│   │   ├── LivePreview/
│   │   ├── PreviewToolbar/
│   │   ├── InlineEditor/
│   │   ├── PageNavigator/
│   │   ├── DeviceToggle/
│   │   └── CodeViewer/
│   ├── integrations/        # SupabaseConnect, GitHubConnect
│   └── settings/            # Account, billing, API keys UI
├── hooks/                   # Custom React hooks
├── pages/                   # Route-level page components
├── store/                   # Zustand store slices
├── services/                # Axios API service functions
├── utils/                   # Helpers, formatters, validators
├── constants/               # App-wide constants
└── main.jsx                 # App entry point
```

---

## Pages & Routes

### Public Routes (No Auth Required)

| Route | Page | Description |
|---|---|---|
| `/` | Landing Page | Marketing page with features, demo, CTA |
| `/login` | Login Page | Email/password + OAuth login |
| `/register` | Register Page | New account creation |
| `/forgot-password` | Password Reset | Request reset email |
| `/reset-password` | Reset Password | New password form via token |

### Protected Routes (Auth Required)

| Route | Page | Description |
|---|---|---|
| `/dashboard` | Dashboard | User project list and stats |
| `/projects/new` | New Project | Start store generation flow |
| `/projects/:id` | Builder | Main store builder with live preview |
| `/projects/:id/code` | Code Viewer | Full file tree and code preview |
| `/projects/:id/settings` | Project Settings | Name, domain, integrations |
| `/projects/:id/deploy` | Deploy | Supabase connect, GitHub push, download |
| `/account` | Account Settings | Profile, password, sessions |
| `/account/billing` | Billing | Plan management |

---

## Page Specifications

### 1. Landing Page (`/`)

The public marketing page. First impression for all visitors.

**Sections:**
- **Hero** — Headline, subheadline, CTA button ("Start Building Free"), animated demo GIF or embedded video showing the generation flow
- **How It Works** — 3-step visual: Describe → Generate → Deploy
- **Feature Highlights** — Live preview, Supabase backend, GitHub push, admin panel, inventory management
- **Template Preview** — Carousel showing screenshots of generated stores
- **Testimonials** — Social proof section
- **Pricing** — Tier cards (Free, Pro, Team)
- **FAQ** — Accordion
- **Footer** — Links, socials, legal

**Behavior:**
- Sticky header with Login / Get Started buttons
- Smooth scroll between sections
- Responsive on mobile, tablet, desktop

---

### 2. Authentication Pages

**Login Page:**
- Email + password fields with validation
- "Login with Google" OAuth button
- "Login with GitHub" OAuth button
- Remember me toggle
- Link to register and forgot password
- Error toast on failed login

**Register Page:**
- Full name, email, password, confirm password
- Password strength indicator
- Terms acceptance checkbox
- On success: redirect to `/dashboard` with welcome toast

**Password Reset:**
- Step 1: Enter email → backend sends reset link
- Step 2: New password + confirm fields via token in URL
- Clear success/error states

---

### 3. Dashboard (`/dashboard`)

The home base after login. Shows all user projects and key stats.

**Layout:**
- Top stats bar: Total Projects, Total Stores Live, Storage Used
- "New Project" CTA button (prominent)
- Projects grid (card view) or list view toggle
- Each project card shows:
  - Store name and creation date
  - Generation status badge (Draft, Generating, Ready, Deployed)
  - Thumbnail screenshot of the generated store (or placeholder)
  - Quick actions: Open Builder, Download, Delete
- Empty state with illustration and "Create your first store" button
- Sidebar with: Dashboard, Projects, Account, Billing, Docs

---

### 4. New Project Flow (`/projects/new`)

A multi-step wizard to kick off a new store generation.

**Step 1 — Store Description (Requirement Input)**

This is the most important UX moment in the entire app. The user describes what they want.

- Large, inviting textarea with placeholder examples:
  > "I want a fashion store selling streetwear for men and women. I need size and color variants, a lookbook page, and Instagram-style product photos."
- "Enhance with AI" button — sends the raw text to the backend for AI-assisted requirement enrichment before spec generation
- Character count and guidance tips panel on the right
- Store category quick-select pills: Fashion, Electronics, Food, Beauty, Sports, Furniture, General
- Optional fields (collapsible):
  - Preferred color palette (color picker)
  - Store name
  - Target market (dropdown)
  - Languages needed

**Step 2 — Specification Review**

After submitting requirements, the AI generates a structured specification. The user reviews it before generation starts.

- Structured spec displayed in a clean card format:
  - Store name and tagline
  - Selected modules list (auth, cart, products, reviews, etc.)
  - Data models overview
  - Page list
  - Feature list
- Each section is editable inline — user can click any field and modify
- "Regenerate Spec" button to re-run the AI with the same requirements
- "Looks Good — Generate Store" primary CTA button

**Step 3 — Generation Progress**

The store is being built. Real-time progress streamed via WebSocket/Socket.IO.

- Full-screen progress view
- Animated progress bar (0–100%)
- Live log stream in a terminal-style panel (scrollable):
  ```
  ✓ Specification validated
  ✓ Template selected: Full E-Commerce v2
  ✓ Auth module applied
  ✓ Product management module applied
  → Generating frontend pages...
  → Assembling backend routes...
  ```
- Step indicators: Spec → Templates → Modules → Files → Formatting → Done
- Estimated time remaining
- On completion: auto-redirect to Builder with success toast

---

### 5. Builder Page (`/projects/:id`) — CORE FEATURE

The builder is the heart of the application. It is a split-pane interface:

```
┌─────────────────────────────────────────────────────┐
│  [Toolbar: Page Selector | Device | Edit Mode | ...]│
├───────────────┬─────────────────────────────────────┤
│               │                                     │
│  Left Sidebar │         Live Preview Panel          │
│  (Page Nav /  │      (iframe or rendered HTML)      │
│   File Tree)  │                                     │
│               │                                     │
└───────────────┴─────────────────────────────────────┘
```

#### Builder Toolbar (Top Bar)

- **Project name** (editable inline)
- **Page selector dropdown** — switch between generated pages (Home, Products, Cart, Checkout, Admin, etc.)
- **Device toggle** — Desktop / Tablet / Mobile (resizes preview iframe)
- **Edit mode toggle** — View mode vs Edit mode (enables inline editing)
- **Code view button** — switches to code viewer panel
- **Undo / Redo** buttons
- **Save** button with auto-save indicator ("Saved 2s ago")
- **Deploy button** — opens deploy modal

#### Left Sidebar

Tabs:
1. **Pages** — List of all generated store pages. Click to navigate in preview
2. **Files** — Full project file tree (like VS Code explorer). Click file to view/edit in code panel
3. **Assets** — Uploaded images and media files

#### Live Preview Panel

This is a rendered HTML preview of the generated store, embedded in an iframe or rendered as actual React components with injected editable zones.

**Core behaviors:**

- **Real-time rendering** — shows the actual store HTML/CSS rendered in the browser
- **Device responsiveness** — iframe width changes based on device toggle
- **Click-to-edit** — when Edit Mode is on, hovering any text element shows a blue outline and pencil icon
- **Inline text editing** — clicking a text element (headings, paragraphs, button labels, nav links) opens a Tiptap inline editor directly on the element
- **Image replacement** — clicking an image opens an upload modal; uploaded image replaces it and updates the project file
- **Color editing** — clicking a colored section opens a color picker; changes propagate to the relevant Tailwind class or CSS variable
- **Section reordering** — drag-and-drop to reorder homepage sections
- **Component toolbar** — when an element is selected, a floating toolbar appears with: Bold, Italic, Link, Text size, Color, Delete section
- **Changes are persisted** — all edits update the project files on the backend via API calls with debouncing
- **No page reload** — edits apply in real time within the preview

**Preview loading states:**
- Skeleton loader while preview builds
- Error state if preview fails with retry option

#### Code Viewer Panel (alternate view)

When the user switches from Preview to Code:

- Monaco Editor in read-only mode by default
- Toggle to edit mode for power users who want to write code directly
- File tree on the left for navigation
- Syntax highlighting for JSX, Python, SQL, JSON
- Search across files (Ctrl+Shift+F)
- "Copy file" and "Download file" buttons per file

---

### 6. Deploy Page (`/projects/:id/deploy`)

Three deployment options, shown as tabs.

**Tab 1 — Download**
- "Download ZIP" button
- Downloads the complete generated project as a `.zip` file
- Includes `README.md` with setup instructions
- Includes `.env.example` with all required variable names

**Tab 2 — Connect Supabase**

This connects the generated store's backend to a real Supabase project.

- Step-by-step guided flow:
  1. "Create a Supabase project" link (opens Supabase in new tab)
  2. Input fields: Supabase Project URL, Supabase Anon Key, Supabase Service Role Key
  3. "Test Connection" button — backend verifies credentials
  4. On success: "Run Migrations" button — backend pushes all SQL migrations to the Supabase project
  5. Status display: each migration shown with ✓ or ✗
  6. "Seed Demo Data" toggle — optionally seeds sample products and categories
  7. Confirmation: "Your store database is ready"
- Connection status badge shown in project card on dashboard
- Stored credentials are encrypted on the backend

**Tab 3 — Push to GitHub**

- "Connect GitHub Account" if not already connected (OAuth flow)
- Repository name input (pre-filled with store name)
- Public / Private toggle
- Organization selector (if user has orgs)
- Branch name input (default: `main`)
- Custom commit message (optional)
- "Push to GitHub" button
- Real-time progress: Creating repo → Committing files → Pushing → Done
- Success state with link to the newly created GitHub repository

---

### 7. Account & Settings Pages

**Account Settings:**
- Avatar upload
- Name and email edit
- Password change
- Active sessions list with revoke buttons
- Danger zone: Delete account

**Billing Page:**
- Current plan display
- Usage meter (projects created, storage used)
- Plan upgrade cards
- Payment method management (Stripe)
- Invoice history

---

## Global UI Components

### App Shell / Layout

- Collapsible left sidebar (icon-only collapsed state)
- Top navbar with user avatar dropdown
- Global command palette (Cmd+K) for quick navigation:
  - Search projects
  - Go to page
  - Quick actions (New Project, Open Docs, etc.)
- Keyboard shortcut hints

### Notification System

- Real-time in-app notifications (via WebSocket or polling):
  - "Your store generation is complete"
  - "Supabase migration succeeded"
  - "GitHub push failed — click to retry"
- Notification bell with unread count badge
- Notification dropdown with list and mark-all-read
- Toast notifications for immediate feedback

### Modals

Reusable modal system for:
- Confirm delete actions
- Image upload
- Color picker
- Deploy flow steps
- Keyboard shortcuts reference

---

## State Management (Zustand)

Zustand stores are split by domain:

```javascript
// auth.store.js
{
  user: null,
  token: null,
  login: (credentials) => {},
  logout: () => {},
  refreshToken: () => {}
}

// projects.store.js
{
  projects: [],
  activeProject: null,
  setActiveProject: (project) => {},
  updateProjectFile: (fileId, content) => {}
}

// builder.store.js
{
  activePage: 'home',
  deviceMode: 'desktop',     // 'desktop' | 'tablet' | 'mobile'
  editMode: false,
  viewMode: 'preview',       // 'preview' | 'code'
  selectedElement: null,
  undoStack: [],
  redoStack: [],
  setActivePage: (page) => {},
  setEditMode: (bool) => {},
  selectElement: (el) => {},
  undo: () => {},
  redo: () => {}
}

// generation.store.js
{
  status: 'idle',            // 'idle' | 'running' | 'complete' | 'error'
  progress: 0,
  logs: [],
  currentStep: null,
  appendLog: (line) => {},
  setProgress: (n) => {}
}

// integrations.store.js
{
  supabase: { connected: false, url: null },
  github: { connected: false, username: null },
  setSupabaseConnection: (data) => {},
  setGithubConnection: (data) => {}
}
```

---

## API Layer (TanStack Query + Axios)

All API calls go through a central Axios instance with:
- Base URL from `import.meta.env.VITE_API_URL`
- JWT token automatically attached via request interceptor
- 401 response interceptor → auto-logout and redirect to `/login`
- Global error handler with toast notification on 5xx errors

TanStack Query is used for all server state:
- Automatic background refetching
- Optimistic updates for inline edits (edit text → update cache → send to backend → rollback on error)
- Query invalidation after mutations
- Infinite scroll for project list and file tree

---

## Real-Time Generation (Socket.IO)

During store generation, the frontend connects to the backend's Socket.IO server:

```javascript
// hooks/useGenerationSocket.js
const socket = io(API_URL, { auth: { token } });

socket.on('generation:progress', ({ percent, step }) => {
  generationStore.setProgress(percent);
  generationStore.setStep(step);
});

socket.on('generation:log', ({ line, level }) => {
  generationStore.appendLog({ line, level, timestamp: Date.now() });
});

socket.on('generation:complete', ({ projectId }) => {
  generationStore.setStatus('complete');
  navigate(`/projects/${projectId}`);
});

socket.on('generation:error', ({ message }) => {
  generationStore.setStatus('error');
  toast.error(message);
});
```

---

## Inline Editing Architecture

The live preview inline editor is one of the most complex features. Here is how it works:

1. The backend generates the store as static HTML files stored server-side.
2. The frontend requests a rendered preview of the active page as HTML from the backend via `GET /projects/:id/preview/:page`.
3. The HTML is injected into a sandboxed `<iframe>` using `srcdoc`.
4. A content script injected into the iframe marks all editable elements with `data-editable-id` attributes.
5. When Edit Mode is on, the iframe intercepts click events and sends a `postMessage` to the parent window with the element's `data-editable-id` and current text.
6. The parent window renders a Tiptap editor overlay anchored to the element's position within the iframe.
7. On editor blur or save, the new content is sent to `PATCH /projects/:id/files/:fileId` with the updated content.
8. The backend writes the change to the project file on disk.
9. The preview auto-refreshes after a 500ms debounce.

This approach avoids complex AST manipulation — edits are string replacements identified by stable `data-editable-id` anchors injected at generation time.

---

## Performance & Production Readiness

- **Code splitting** — every route is lazy loaded with `React.lazy` and `Suspense`
- **Image optimization** — all images use `loading="lazy"` and WebP where possible
- **Memoization** — expensive components wrapped in `React.memo`; heavy calculations in `useMemo` / `useCallback`
- **Virtualization** — long file trees and log lists use `react-window` for virtual scrolling
- **Bundle analysis** — Vite bundle visualizer included in dev scripts
- **Error boundaries** — every major section wrapped in `ErrorBoundary` to isolate failures
- **Optimistic UI** — inline edits apply instantly, with rollback on API failure
- **PWA** — service worker for offline dashboard access (read-only)
- **CSP headers** — Content Security Policy configured for iframe sandboxing

---

## Environment Variables

```env
VITE_API_URL=https://api.asea.app
VITE_SOCKET_URL=wss://api.asea.app
VITE_GITHUB_CLIENT_ID=gh_xxxxx
VITE_GOOGLE_CLIENT_ID=google_xxxxx
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxx
VITE_POSTHOG_KEY=phc_xxxxx         # Analytics
```

---

## Folder & File Naming Conventions

- Pages: `PascalCase` (e.g., `BuilderPage.jsx`)
- Components: `PascalCase` (e.g., `LivePreview.jsx`)
- Hooks: `camelCase` prefixed with `use` (e.g., `useGenerationSocket.js`)
- Stores: `camelCase.store.js`
- Services: `camelCase.service.js`
- Utils: `camelCase.util.js`

---

## Deployment

- **Hosting:** Vercel (recommended) or Netlify
- **Build command:** `vite build`
- **Output directory:** `dist/`
- **Environment variables** set in Vercel dashboard per environment (preview vs production)
- **CI/CD:** GitHub Actions pipeline:
  1. Lint (ESLint)
  2. Unit tests (Vitest)
  3. Build
  4. Deploy to Vercel

---

## Development Order (Frontend)

1. Project scaffold (Vite + React + Tailwind + Router setup)
2. Auth pages and Zustand auth store
3. Dashboard page and project card components
4. New Project wizard (Step 1: requirement input)
5. Generation progress page with Socket.IO integration
6. Specification review page
7. Builder toolbar and layout shell
8. Live preview iframe integration
9. Inline editing (Tiptap overlay system)
10. Code viewer (Monaco Editor integration)
11. Deploy page (Download, Supabase connect, GitHub push)
12. Account and settings pages
13. Notifications system
14. Command palette (Cmd+K)
15. Billing page (Stripe integration)
16. Polish: animations, empty states, error boundaries, responsive design
17. Testing (Vitest unit tests, Playwright E2E)
