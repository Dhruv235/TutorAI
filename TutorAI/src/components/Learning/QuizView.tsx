import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Clock, ArrowRight, ArrowLeft } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { openaiService, QuizQuestion } from '../../services/openai'

const QuizView: React.FC = () => {
  const {
    currentLesson,
    currentTopic,
    quizAnswers,
    setQuizAnswers,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    setIsLoading,
    isLoading,
    setError
  } = useStore()
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    if (currentLesson && questions.length === 0) {
      generateQuiz()
    }
  }, [currentLesson])

  const generateQuiz = async () => {
    if (!currentLesson || !currentTopic) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const quizQuestions = await openaiService.generateQuiz(
        currentTopic.title,
        currentTopic.difficulty,
        currentLesson.content
      )
      
      setQuestions(quizQuestions)
      setQuizAnswers(new Array(quizQuestions.length).fill(-1))
    } catch (error: any) {
      setError(error.message || 'Failed to generate quiz')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    const newAnswers = [...quizAnswers]
    newAnswers[currentQuestionIndex] = answerIndex
    setQuizAnswers(newAnswers)
  }

  const handleNext = () => {
    if (selectedAnswer !== null) {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setSelectedAnswer(quizAnswers[currentQuestionIndex + 1] !== -1 ? quizAnswers[currentQuestionIndex + 1] : null)
        setShowResult(false)
      } else {
        setQuizComplete(true)
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setSelectedAnswer(quizAnswers[currentQuestionIndex - 1] !== -1 ? quizAnswers[currentQuestionIndex - 1] : null)
      setShowResult(false)
    }
  }

  const handleShowResult = () => {
    if (selectedAnswer !== null) {
      setShowResult(true)
    }
  }

  const calculateScore = () => {
    let correct = 0
    quizAnswers.forEach((answer, index) => {
      if (answer === questions[index]?.correctAnswer) {
        correct++
      }
    })
    return Math.round((correct / questions.length) * 100)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Generating your quiz...</p>
        </motion.div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No quiz questions available.</p>
      </div>
    )
  }

  if (quizComplete) {
    const score = calculateScore()
    const timeSpent = Math.round((Date.now() - startTime) / 60000)
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            {score >= 80 ? (
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            ) : (
              <XCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            )}
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
            <p className="text-xl text-gray-600">
              You scored {score}% ({quizAnswers.filter((answer, index) => answer === questions[index]?.correctAnswer).length}/{questions.length})
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{score}%</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{timeSpent}m</div>
              <div className="text-sm text-gray-600">Time Spent</div>
            </div>
          </div>

          <div className="space-y-4">
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Review Answers
            </button>
            <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              Try Another Topic
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium">Quiz</span>
            </div>
            <div className="text-sm">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-2 mb-4">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {currentQuestion?.question}
              </h2>

              <div className="space-y-4 mb-8">
                {currentQuestion?.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedAnswer === index
                        ? showResult
                          ? index === currentQuestion.correctAnswer
                            ? 'border-green-500 bg-green-50'
                            : 'border-red-500 bg-red-50'
                          : 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium mr-3">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-gray-900">{option}</span>
                      {showResult && selectedAnswer === index && (
                        <div className="ml-auto">
                          {index === currentQuestion.correctAnswer ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {showResult && currentQuestion?.explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl mb-6 ${
                    isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </h3>
                  <p className="text-gray-700">{currentQuestion.explanation}</p>
                </motion.div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center space-x-2 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <div className="flex space-x-3">
                  {!showResult && selectedAnswer !== null && (
                    <button
                      onClick={handleShowResult}
                      className="px-6 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      Check Answer
                    </button>
                  )}
                  
                  <button
                    onClick={handleNext}
                    disabled={selectedAnswer === null}
                    className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span>{currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default QuizView