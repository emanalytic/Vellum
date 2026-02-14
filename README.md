# Vellum 📜

> _Time is the brush. The day is the canvas._

**Vellum** is a lo-fi, sketchbook-style productivity application designed to help students and lifelong learners organize their lives with intention. It blends a nostalgic, tactile "pen and paper" aesthetic with powerful AI agents to help break down complex tasks, schedule study sessions, and track focus.

---

## ✨ Key Features

### 🎨 Sketchbook Aesthetic

- **Tactile UI**: Custom Tailwind configuration mimicking real paper textures, ink bleeds, and highlighter strokes.
- **Hand-Drawn Icons**: Integrated `lucide-react` icons styled to look sketched.
- **Micro-Interactions**: Satisfying "tape" effects, analyzing animations, and responsive hover states.

### 🧠 AI-Powered Breakdown

- **Task Analysis**: Uses **Groq** (LLM) to analyze task complexity (beginner to master).
- **Auto-Chunking**: Automatically breaks down large, vague goals (e.g., "Learn React") into actionable, bite-sized steps with estimated durations.
- **Skill-Based Estimation**: Adjusts time estimates based on your self-reported mastery level.

### 📅 Smart Scheduling ("The Blueprint")

- **Custom Calendar View**: A bespoke daily/weekly planner built from scratch (no heavy calendar libraries).
- **Drag-and-Drop Organization**: Intuitively place tasks into time slots.
- **Availability Windows**: Define your "Early Bird" or "Night Owl" hours to respect your natural rhythm.
- **Visual Conflict Detection**: Smartly positions overlapping tasks to prevent scheduling conflicts.

### ⏱️ Deep Work Tools

- **Floating Focus Timer**: A persistent timer that tracks your "Deep Work" sessions.
- **Session Logging**: Automatically logs time spent on specific tasks to the backend.
- **Progress Tracking**: Visual progress bars and "Mastered" stamps for completed pursuits.

### 📊 Insights & Analytics

- **Productivity Charts**: Visualizes your focus distribution and output velocity.
- **Review System**: Weekly and daily review modes to reflect on your progress.

---

## 🛠️ Tech Stack

### Frontend (`/frontend`)

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **State/Auth**: [Supabase Data Client](https://supabase.com/docs/reference/javascript/introduction)

### Backend (`/backend`)

- **Framework**: [NestJS](https://nestjs.com/)
- **Language**: TypeScript
- **Database**: [Supabase (PostgreSQL)](https://supabase.com/)
- **AI**: [Groq SDK](https://groq.com/) (Llama 3 / Mixtral models)
- **Validation**: `class-validator` + `class-transformer`

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm** or **pnpm**
- **Supabase Account**: You'll need a project URL and Anon Key.
- **Groq API Key**: For the AI task breakdown features.

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/vellum.git
cd vellum
```

### 2. Backend Setup

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` based on the template:

```env
# backend/.env
PORT=3000
CORS_ORIGIN=http://localhost:5173

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# AI Configuration (Groq)
GROQ_API_KEY=gsk_...
```

Start the backend development server:

```bash
npm run start:dev
```

### 3. Frontend Setup

Open a new terminal, navigate to the frontend folder, and install dependencies:

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` (Note: Vite requires `VITE_` prefix):

```env
# frontend/.env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:3000
```

Start the frontend development server:

```bash
npm run dev
```

Visit `http://localhost:5173` to view the app!

---

## 📂 Project Structure

```
vellum/
├── backend/                # NestJS API
│   ├── src/
│   │   ├── ai/             # AI processing & Groq integration
│   │   ├── auth/           # Auth guards & strategies
│   │   ├── scheduler/      # Smart scheduling logic
│   │   ├── supabase/       # Database connection
│   │   ├── tasks/          # Task CRUD & business logic
│   │   ├── app.module.ts   # Root module
│   │   └── main.ts         # Entry point
│   └── test/               # E2E tests
│
├── frontend/               # React Client
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/     # Reusable UI (Buttons, Logo, Timer)
│   │   │   ├── layout/     # Sidebar, Modals
│   │   │   └── tasks/      # Task cards, Chunk panel
│   │   ├── context/        # Toast & Confirm contexts
│   │   ├── hooks/          # useTasks (central logic)
│   │   ├── pages/          # Login & Auth pages
│   │   ├── services/       # API & Supabase clients
│   │   ├── views/          # Calendar, Journal, Analysis views
│   │   └── types/          # Shared TypeScript interfaces
│   └── index.css           # Global Tailwind imports
```

---

## 🎨 Design System

Vellum uses a simplified "CSS-in-JS" approach via Tailwind utility classes to achieve its unique look:

- **Colors**:
  - `bg-paper-bg`: A bespoke off-white/noise texture.
  - `text-ink`: #1a1a1a (Soft black for text).
  - `bg-highlighter-yellow`: #fef08a (Classic fluorescent yellow).
  - `bg-highlighter-pink`: #fbcfe8 (Fluorescent pink accent).
- **Fonts**:
  - `font-hand`: Custom handwritten font family for notes.
  - `font-sketch`: Uppercase, blocky font for headers.
  - `font-marker`: Bold, permanent-marker style for emphasis.
- **Borders**:
  - `sketch-border`: Custom utility adding loose, hand-drawn SVG borders or CSS `border-image`.

---

## 🤖 AI Integration

The AI features are powered by **Groq**, specifically leveraging fast inference models like **Llama 3** to provide near-instant feedback.

- **Endpoint**: `POST /ai/classify-task`
- **Input**: User task description ("Review Physics notes") + Skill Level.
- **Output**: Structured JSON containing:
  - `workload_type`: (e.g., "Recall/Memorization")
  - `estimated_duration`: accurate time prediction.
  - `suggested_chunks`: list of sub-tasks (e.g., "Read Chapter 4", "Solve Practice Problem 1").

---

## 🤝 Contributing

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
