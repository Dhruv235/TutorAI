import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from './store/useStore'
import { authService } from './services/supabase'
import ErrorBoundary from './components/Common/ErrorBoundary'
import Header from './components/Layout/Header'
import AuthForm from './components/Auth/AuthForm'
import TopicSelector from './components/Learning/TopicSelector'
import LessonView from './components/Learning/LessonView'
import QuizView from './components/Learning/QuizView'
import ProgressDashboard from './components/Learning/ProgressDashboard'

const App: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const [currentView, setCurrentView] = useState<'topic' | 'lesson' | 'quiz' | 'progress'>('topic')
  
  const { 
    currentTopic, 
    currentLesson, 
    currentQuiz,
    error,
    setError
  } = useStore()

  useEffect(() => {
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (currentTopic && !currentLesson) {
      setCurrentView('lesson')
    } else if (currentLesson && !currentQuiz) {
      setCurrentView('quiz')
    }
  }, [currentTopic, currentLesson, currentQuiz])


  const handleNavigation = (view: 'topic' | 'lesson' | 'quiz' | 'progress') => {
    setCurrentView(view)
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!authService.session()) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-bold text-gray-900 mb-4"
              >
                TutorAI
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-600"
              >
                Your AI-powered personalized learning companion
              </motion.p>
            </div>
            
            <div className="flex items-center justify-center">
              <AuthForm isLogin={isLogin} onToggle={() => setIsLogin(!isLogin)} />
            </div>
          </div>
        </div>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {['topic', 'progress'].map((view) => (
                <button
                  key={view}
                  onClick={() => handleNavigation(view as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors ${
                    currentView === view
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {view === 'topic' ? 'Learn' : view}
                </button>
              ))}
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <p className="text-red-600">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            )}

            {currentView === 'topic' && (
              <motion.div
                key="topic"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <TopicSelector />
              </motion.div>
            )}

            {currentView === 'lesson' && currentTopic && (
              <motion.div
                key="lesson"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <LessonView />
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setCurrentView('quiz')}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Take Quiz
                  </button>
                </div>
              </motion.div>
            )}

            {currentView === 'quiz' && currentLesson && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <QuizView />
              </motion.div>
            )}

            {currentView === 'progress' && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ProgressDashboard />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </ErrorBoundary>
  )
}

export default App