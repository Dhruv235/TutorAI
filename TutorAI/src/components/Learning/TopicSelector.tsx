import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, BookOpen, Lightbulb, Calculator, Globe, Atom } from 'lucide-react'
import { useStore } from '../../store/useStore'

const popularTopics = [
  { icon: Calculator, name: 'Mathematics', color: 'bg-blue-500' },
  { icon: Atom, name: 'Physics', color: 'bg-purple-500' },
  { icon: BookOpen, name: 'Literature', color: 'bg-green-500' },
  { icon: Globe, name: 'History', color: 'bg-red-500' },
  { icon: Lightbulb, name: 'Science', color: 'bg-yellow-500' }
]

const TopicSelector: React.FC = () => {
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
  const { setCurrentTopic } = useStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (topic.trim()) {
      setCurrentTopic({
        id: Date.now().toString(),
        title: topic.trim(),
        description: `Learn about ${topic.trim()}`,
        difficulty,
        tags: [topic.trim().toLowerCase()],
        estimatedTime: 30
      })
    }
  }

  const handleTopicClick = (topicName: string) => {
    setTopic(topicName)
    setCurrentTopic({
      id: Date.now().toString(),
      title: topicName,
      description: `Learn about ${topicName}`,
      difficulty,
      tags: [topicName.toLowerCase()],
      estimatedTime: 30
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          What would you like to learn today?
        </h2>
        <p className="text-xl text-gray-600">
          Choose a topic and let AI create a personalized lesson just for you
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter any topic you want to learn..."
              className="w-full pl-10 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
            className="px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-medium text-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={!topic.trim()}
        >
          Start Learning
        </motion.button>
      </form>

      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Or choose from popular topics:
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {popularTopics.map((item, index) => (
            <motion.button
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTopicClick(item.name)}
              className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className={`p-3 rounded-full ${item.color} mb-3`}>
                <item.icon className="h-6 w-6 text-white" />
              </div>
              <span className="font-medium text-gray-900">{item.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default TopicSelector