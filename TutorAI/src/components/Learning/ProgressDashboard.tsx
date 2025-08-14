import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Clock, BookOpen, Target, Calendar } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { progressService } from '../../services/supabase'

const ProgressDashboard: React.FC = () => {
  const { userProgress, setUserProgress } = useStore()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalLessons: 0,
    totalTimeSpent: 0,
    averageScore: 0,
    streak: 0
  })

  useEffect(() => {
    loadProgress()
  }, [])

  const loadProgress = async () => {
    try {
      setLoading(true)
      // For now, use mock data since we don't have authentication
      const mockProgress = userProgress
      setUserProgress(mockProgress)
      calculateStats(mockProgress)
    } catch (error) {
      console.error('Error loading progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (progress: any[]) => {
    const totalLessons = progress.length
    const totalTimeSpent = progress.reduce((sum, p) => sum + (p.time_spent || 0), 0)
    const averageScore = progress.length > 0 
      ? Math.round(progress.reduce((sum, p) => sum + (p.quiz_score || 0), 0) / progress.length)
      : 0
    
    // Calculate streak (consecutive days with activity)
    const sortedProgress = progress.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
    let streak = 0
    let currentDate = new Date()
    
    for (const p of sortedProgress) {
      const progressDate = new Date(p.completed_at)
      const diffDays = Math.floor((currentDate.getTime() - progressDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === streak) {
        streak++
      } else {
        break
      }
    }

    setStats({
      totalLessons,
      totalTimeSpent: Math.round(totalTimeSpent / 60), // Convert to minutes
      averageScore,
      streak
    })
  }

  const weeklyData = userProgress.slice(0, 7).map((p, index) => ({
    day: new Date(p.completedAt).toLocaleDateString('en-US', { weekday: 'short' }),
    score: p.quizScore,
    time: Math.round(p.timeSpent / 60)
  })).reverse()

  const difficultyData = [
    { name: 'Beginner', value: userProgress.filter(p => p.difficulty === 'beginner').length, color: '#10B981' },
    { name: 'Intermediate', value: userProgress.filter(p => p.difficulty === 'intermediate').length, color: '#F59E0B' },
    { name: 'Advanced', value: userProgress.filter(p => p.difficulty === 'advanced').length, color: '#EF4444' }
  ].filter(d => d.value > 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your progress...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Learning Progress</h2>
        <p className="text-gray-600">Track your journey and achievements</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalLessons}</h3>
          <p className="text-gray-600">Lessons Completed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.averageScore}%</h3>
          <p className="text-gray-600">Average Score</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalTimeSpent}m</h3>
          <p className="text-gray-600">Time Spent</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.streak}</h3>
          <p className="text-gray-600">Day Streak</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Difficulty Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={difficultyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {difficultyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {userProgress.slice(0, 5).map((progress, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{progress.lessonId}</h4>
                <p className="text-sm text-gray-600">
                  {new Date(progress.completedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">{progress.quizScore}%</div>
                <div className="text-sm text-gray-600">{Math.round(progress.timeSpent / 60)}m</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProgressDashboard