import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, BookOpen, ArrowRight, Lightbulb } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { useStore } from '../../store/useStore'
import { openaiService, LessonContent } from '../../services/openai'

const LessonView: React.FC = () => {
  const { currentTopic, setCurrentLesson, setIsLoading, isLoading, setError } = useStore()
  const [lessonContent, setLessonContent] = useState<LessonContent | null>(null)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    if (currentTopic && !lessonContent) {
      generateLesson()
    }
  }, [currentTopic])

  const generateLesson = async () => {
    if (!currentTopic) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const lesson = await openaiService.generateLesson(
        currentTopic.title,
        currentTopic.difficulty
      )
      
      setLessonContent(lesson)
      setCurrentLesson({
        id: Date.now().toString(),
        topicId: currentTopic.id,
        title: lesson.title,
        content: lesson.content,
        difficulty: lesson.difficulty,
        examples: lesson.examples,
        keyPoints: lesson.keyPoints
      })
    } catch (error: any) {
      setError(error.message || 'Failed to generate lesson')
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinueToQuiz = () => {
    // Navigate to quiz - this would be handled by the parent component
    console.log('Continue to quiz')
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
          <p className="text-lg text-gray-600">Creating your personalized lesson...</p>
        </motion.div>
      </div>
    )
  }

  if (!lessonContent) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No lesson content available.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6" />
              <span className="text-sm font-medium opacity-90">Lesson</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">~{currentTopic?.estimatedTime || 30} min</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">{lessonContent.title}</h1>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
              {lessonContent.difficulty}
            </span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
              {currentTopic?.tags?.join(', ')}
            </span>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-900 mb-4">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-semibold text-gray-800 mb-3">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-medium text-gray-700 mb-2">{children}</h3>,
                p: ({ children }) => <p className="text-gray-600 mb-4 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="text-gray-600">{children}</li>,
                code: ({ children }) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>,
                blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700">{children}</blockquote>
              }}
            >
              {lessonContent.content}
            </ReactMarkdown>
          </div>

          {lessonContent.keyPoints && lessonContent.keyPoints.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-blue-50 rounded-xl p-6 mb-8"
            >
              <div className="flex items-center mb-4">
                <Lightbulb className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Key Points to Remember</h3>
              </div>
              <ul className="space-y-2">
                {lessonContent.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {lessonContent.examples && lessonContent.examples.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-green-50 rounded-xl p-6 mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Examples</h3>
              <div className="space-y-4">
                {lessonContent.examples.map((example, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        p: ({ children }) => <p className="text-gray-700 mb-2">{children}</p>,
                        code: ({ children }) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>
                      }}
                    >
                      {example}
                    </ReactMarkdown>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinueToQuiz}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-medium text-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Continue to Quiz</span>
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default LessonView