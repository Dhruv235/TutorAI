import React from 'react'
import { motion } from 'framer-motion'
import { User, LogOut, BarChart3, BookOpen } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { authService } from '../../services/supabase'

const Header: React.FC = () => {
  const { resetSession } = useStore()

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white shadow-sm border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
          >
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">TutorAI</h1>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              Welcome to TutorAI
            </span>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header