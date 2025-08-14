import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Topic, Lesson, Quiz, UserProgress, LearningSession } from '../types'

interface AppState {
  // User state
  user: User | null
  setUser: (user: User | null) => void
  
  // Learning state
  currentTopic: Topic | null
  currentLesson: Lesson | null
  currentQuiz: Quiz | null
  currentSession: LearningSession | null
  
  setCurrentTopic: (topic: Topic | null) => void
  setCurrentLesson: (lesson: Lesson | null) => void
  setCurrentQuiz: (quiz: Quiz | null) => void
  setCurrentSession: (session: LearningSession | null) => void
  
  // Progress state
  userProgress: UserProgress[]
  setUserProgress: (progress: UserProgress[]) => void
  addProgress: (progress: UserProgress) => void
  
  // UI state
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  
  // Quiz state
  quizAnswers: number[]
  setQuizAnswers: (answers: number[]) => void
  currentQuestionIndex: number
  setCurrentQuestionIndex: (index: number) => void
  
  // Error state
  error: string | null
  setError: (error: string | null) => void
  
  // Reset functions
  resetQuiz: () => void
  resetSession: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),
      
      // Learning state
      currentTopic: null,
      currentLesson: null,
      currentQuiz: null,
      currentSession: null,
      
      setCurrentTopic: (topic) => set({ currentTopic: topic }),
      setCurrentLesson: (lesson) => set({ currentLesson: lesson }),
      setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
      setCurrentSession: (session) => set({ currentSession: session }),
      
      // Progress state
      userProgress: [],
      setUserProgress: (progress) => set({ userProgress: progress }),
      addProgress: (progress) => set((state) => ({
        userProgress: [progress, ...state.userProgress]
      })),
      
      // UI state
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
      
      // Quiz state
      quizAnswers: [],
      setQuizAnswers: (answers) => set({ quizAnswers: answers }),
      currentQuestionIndex: 0,
      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
      
      // Error state
      error: null,
      setError: (error) => set({ error }),
      
      // Reset functions
      resetQuiz: () => set({
        quizAnswers: [],
        currentQuestionIndex: 0,
        currentQuiz: null
      }),
      
      resetSession: () => set({
        currentTopic: null,
        currentLesson: null,
        currentQuiz: null,
        currentSession: null,
        quizAnswers: [],
        currentQuestionIndex: 0
      })
    }),
    {
      name: 'learning-tutor-storage',
      partialize: (state) => ({
        user: state.user,
        userProgress: state.userProgress,
        currentTopic: state.currentTopic,
        currentLesson: state.currentLesson
      })
    }
  )
)