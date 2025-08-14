export interface User {
  id: string;
  email: string;
  name: string;
  grade?: string;
  preferences?: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    subjects: string[];
  };
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  estimatedTime: number;
}

export interface Lesson {
  id: string;
  topicId: string;
  title: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  examples: string[];
  keyPoints: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  questions: QuizQuestion[];
  timeLimit?: number;
}

export interface WalkthroughStep {
  id: string;
  title: string;
  content: string;
  explanation: string;
}

export interface UserProgress {
  id: string;
  userId: string;
  lessonId: string;
  quizScore: number;
  timeSpent: number;
  completedAt: Date;
  difficulty: string;
}

export interface LearningSession {
  topic: Topic;
  lesson: Lesson;
  quiz: Quiz;
  userAnswers: number[];
  score: number;
  walkthrough?: WalkthroughStep[];
}