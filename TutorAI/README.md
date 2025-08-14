# TutorAI - GPT-4 Powered Personalized Learning Tutor

A sophisticated AI-powered educational platform that creates personalized learning experiences using OpenAI's GPT-4. Built with React, TypeScript, and modern web technologies.

## Features

### 🧠 AI-Powered Learning
- **Dynamic Lesson Generation**: GPT-4 creates custom lessons based on user topics and difficulty preferences
- **Adaptive Quizzes**: Intelligent quiz generation that matches lesson content and difficulty level
- **Step-by-Step Walkthroughs**: AI-generated explanations for incorrect answers to promote learning

### 📊 Progress Tracking
- **Comprehensive Analytics**: Track learning progress with detailed statistics and visualizations
- **Performance Insights**: Monitor quiz scores, time spent, and learning streaks
- **Difficulty Distribution**: Analyze learning patterns across different difficulty levels

### 🎨 Modern UI/UX
- **Beautiful Interface**: Clean, professional design with smooth animations
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Interactive Elements**: Hover states, transitions, and micro-interactions throughout

### 🔐 User Management
- **Secure Authentication**: User registration and login with Supabase Auth
- **Personalized Profiles**: Individual learning preferences and progress tracking
- **Data Persistence**: Automatic saving of progress and session data

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Zustand** for state management

### Backend & Services
- **Supabase** for database and authentication
- **OpenAI GPT-4** for content generation
- **Vite** for build tooling

### UI Components
- **Lucide React** for icons
- **Recharts** for data visualization
- **React Markdown** for content rendering
- **KaTeX** for mathematical expressions

## Getting Started

### Prerequisites
- Node.js 18+ 
- OpenAI API key
- Supabase project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tutorai.git
cd tutorai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in your API keys:
- `VITE_OPENAI_API_KEY`: Your OpenAI API key
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

4. Start the development server:
```bash
npm run dev
```

## Usage

### For Students
1. **Sign Up/Login**: Create an account or sign in to access personalized features
2. **Choose a Topic**: Enter any topic you want to learn about
3. **Set Difficulty**: Select your preferred difficulty level (beginner, intermediate, advanced)
4. **Study the Lesson**: Read through the AI-generated lesson content
5. **Take the Quiz**: Test your understanding with tailored questions
6. **Review Progress**: Track your learning journey in the progress dashboard

### For Educators
- Use the platform to create supplementary learning materials
- Leverage AI-generated content for curriculum development
- Monitor student progress and engagement

## Key Features in Detail

### Lesson Generation
- GPT-4 creates comprehensive lessons with explanations, examples, and key points
- Content is tailored to the specified difficulty level
- Mathematical expressions are rendered using KaTeX
- Markdown formatting ensures clean, readable content

### Quiz System
- Automatically generates multiple-choice questions based on lesson content
- Provides detailed explanations for correct answers
- Tracks performance and provides immediate feedback
- Adaptive difficulty based on user performance

### Progress Analytics
- Visual charts showing weekly performance trends
- Statistics on completion rates, average scores, and time spent
- Difficulty distribution analysis
- Learning streak tracking

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for providing the GPT-4 API
- Supabase for backend infrastructure
- The React and TypeScript communities for excellent tooling
- All contributors who help improve this project

## Support

For support, please open an issue on GitHub or contact the development team.