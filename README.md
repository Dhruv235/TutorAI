# Personalized Learning Tutor 🧠

**Description:**  
An AI-powered personalized learning web app where students input a topic (e.g. 'Riemann sums') and receive an adaptive lesson—GPT-4-generated explanations, interactive quizzes, and walkthroughs. Built with Next.js 15, Supabase, Tailwind CSS, and OpenAI API.

## ✨ Features
- Input any topic and get an adaptive AI lesson
- Interactive quizzes with instant feedback
- Step-by-step GPT-4 walkthroughs of problems
- Track user progress and adjust difficulty
- Beautiful, responsive UI built with TailwindCSS

## 🚀 Tech Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js 20, Next.js API routes
- **Database**: Supabase (PostgreSQL + Auth)
- **AI**: OpenAI GPT-4 API
- **State Management**: Zustand or Redux Toolkit
- **Math Rendering**: KaTeX
- **Hosting**: Vercel
- **Testing**: Jest, Cypress
- **Monitoring**: Sentry

## 🧩 Folder Structure (Sample)
```
/app
  /components
  /pages
  /api
  /styles
  /lib
  /utils
```

## 🛠 Setup Instructions

1. **Clone the repo**
```bash
git clone https://github.com/your-username/personalized-tutor.git
cd personalized-tutor
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
Create a `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-api-key
```

4. **Run the dev server**
```bash
npm run dev
```

5. **Deploy**
Use [Vercel](https://vercel.com) for 1-click deployment with GitHub integration.

## ✅ RLS Policies
RLS is configured per table for strict user access. See `rls_policies.sql` for exact SQL.

## 📄 License
MIT License
