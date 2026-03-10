Plan: ASEA Frontend Full Implementation
TL;DR: The scaffold (React 19 + Vite 8 + Tailwind v4) exists with a basic landing page and no routing. The plan builds out all 17 development-order items from the spec in 9 phases, starting with installing libraries and wiring up infrastructure, then Auth → Dashboard → Builder → Deploy → Polish → Tests.

Current State
App.jsx renders Header + Home + Footer with no routing
No required libraries installed (no Router, Zustand, Axios, etc.)
App.css contains unused boilerplate to remove
@ path alias and dark theme are already set up
Phase 1 — Foundation & Infrastructure
All steps independent, can proceed in parallel per concern

Install npm dependencies — react-router-dom, zustand, @tanstack/react-query, react-hook-form, zod, axios, socket.io-client, @monaco-editor/react, @tiptap/react + extensions, framer-motion, react-hot-toast, lucide-react, recharts, react-window
Router setup — Wrap app in BrowserRouter, define all public/protected routes using React.lazy + Suspense for code splitting. Create ProtectedRoute wrapper that checks Zustand auth token.
Zustand stores — Create 5 store files: auth.store.js, projects.store.js, builder.store.js, generation.store.js, integrations.store.js per spec shapes
Axios instance — src/services/api.js with base URL from VITE_API_URL, JWT request interceptor, 401 → logout + redirect interceptor, 5xx toast handler
TanStack Query provider — QueryClient with sensible defaults added to main.jsx
Folder restructure — Create common/, layout/, auth/, dashboard/, builder/, integrations/, settings/ under components/; hooks/, store/, services/, utils/, constants/ under src/
Delete App.css boilerplate, replace App.jsx with Router outlet layout
Phase 2 — Auth System
Depends on Phase 1

Common UI primitives — Button, Input, Modal, Badge, Spinner, ErrorBoundary in components/common/
AppShell layout — Collapsible sidebar (icon-only collapsed state), top Navbar with user avatar dropdown — components/layout/
Login page — React Hook Form + Zod validation, Google/GitHub OAuth buttons, remember me, links to register/forgot-password, error toast
Register page — Full name, email, password, confirm, strength indicator, terms checkbox, redirect to /dashboard on success
Password Reset pages — Forgot (email input) + Reset (new password via URL token)
auth.service.js — login, register, refresh token, OAuth handlers
Phase 3 — Dashboard
Depends on Phase 2

Dashboard page — Stats bar (projects, stores live, storage), "New Project" CTA, projects grid/list toggle, empty state with illustration
ProjectCard component — name, date, status badge, thumbnail, quick actions (Open Builder, Download, Delete)
projects.service.js — list, create, delete, get project API calls (TanStack Query hooks)
Phase 4 — New Project Wizard
Depends on Phase 3

Step 1 — RequirementInput — large textarea with placeholder examples, "Enhance with AI" button, category quick-select pills, collapsible optional fields (color palette, store name, target market, languages)
Step 2 — SpecificationReview — structured spec cards with inline-editable fields, "Regenerate Spec" + "Generate Store" CTAs
Step 3 — GenerationProgress — useGenerationSocket.js hook, animated progress bar, terminal-style scrollable log, step indicators, auto-redirect on generation:complete
Phase 5 — Builder Page (Core Feature)
Depends on Phase 4

Builder layout shell — split pane: left sidebar + main preview panel
Builder toolbar — inline project name edit, page selector dropdown, device toggle, edit/view mode toggle, undo/redo, save with auto-save indicator, deploy button
Left sidebar tabs — Pages list, Files tree, Assets — with react-window virtualization for file tree
LivePreview panel — iframe with srcdoc, skeleton loader, error state, responds to device toggle width changes
Inline editing system — iframe postMessage bridge, data-editable-id click intercept, Tiptap overlay anchored to element bounding rect, PATCH with 500ms debounce, preview auto-refresh
Image replacement modal — click image → upload dialog → API → preview refresh
Color picker overlay — click colored section → picker → propagate to CSS variable
Section drag-and-drop — reorder homepage sections
Phase 6 — Code Viewer & Deploy
Parallel with Phase 5 polish

Code Viewer — Monaco Editor, read-only + editable toggle, file tree navigation, JSX/Python/SQL/JSON syntax highlighting, cross-file search, copy/download per file
Deploy page — 3 tabs:
Download: ZIP with README + .env.example
Supabase Connect: guided flow → test connection → run migrations → seed toggle
GitHub Push: OAuth connect, repo name/visibility/org/branch/commit inputs, real-time push progress, success link
integrations.service.js — Supabase connection test, migration runner, GitHub OAuth + push
Phase 7 — Account, Notifications & Billing
Parallel with Phase 6

Account Settings page — avatar upload, name/email/password edit, active sessions + revoke, delete account danger zone
Billing page — plan display, usage meters, upgrade cards, Stripe payment method, invoice history
Notification system — bell icon with unread badge, WebSocket/polling for real-time alerts, dropdown list, mark-all-read, toast integration
Phase 8 — Global Polish
Command palette — Cmd+K, search projects + quick navigation using lucide-react icons
Framer Motion — page transitions, modal animations, progress micro-animations
Full Landing Page rebuild — Hero, How It Works, Features, Template carousel, Testimonials, Pricing tiers, FAQ accordion, Footer (replaces current basic Home.jsx)
Responsive pass — 375px / 768px / 1280px+ breakpoints across all pages
Error boundaries — wrap every major route section
PWA — service worker for offline dashboard (read-only)
Phase 9 — Testing
Vitest unit tests — stores, hooks (useGenerationSocket), utils/, service functions
Playwright E2E — auth flow, project creation wizard, builder inline edit, deploy tabs
Relevant Files
Modify:

main.jsx — add QueryClient, BrowserRouter, Toaster
App.jsx — replace with Router outlet layout
index.html — title update
package.json — add all dependencies
Create (key files):

src/store/ — 5 Zustand store files
src/services/api.js + 4 service files
src/hooks/useGenerationSocket.js
src/components/common/ — 6 primitive components
src/components/layout/AppShell.jsx, Sidebar.jsx, Navbar.jsx
src/pages/ — 13 route-level page components
.env — all VITE_* environment variables
Verification
npm run dev — all routes resolve, no console errors
Auth flow — register → dashboard redirect, protected route blocks unauthenticated access
Socket.IO — mock backend events drive progress bar and log updates
Builder iframe — inline edit applies change, debounced PATCH fires, preview refreshes
Monaco Editor — loads in code viewer, file switching works
Deploy tabs — Supabase test connection, GitHub push progress, ZIP download all work
npm run build — clean build, no errors
Responsive — verified at 375px, 768px, 1440px
npm run lint — zero ESLint errors