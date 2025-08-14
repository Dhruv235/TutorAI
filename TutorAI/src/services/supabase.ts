import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Check if environment variables are set and not placeholder values
const isValidUrl = supabaseUrl && supabaseUrl !== 'your_supabase_url_here' && supabaseUrl.startsWith('https://')
const isValidKey = supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key_here'

if (!isValidUrl || !isValidKey) {
  console.warn('Supabase environment variables are not set. Some features may not work properly.')
}

export const supabase = isValidUrl && isValidKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const authService = {
  async signUp(email: string, password: string, name: string) {
    if (!supabase) {
      throw new Error('Supabase is not configured. Please set up your environment variables.')
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    })
    if (error) throw error
    return data
  },

  async signIn(email: string, password: string) {
    if (!supabase) {
      throw new Error('Supabase is not configured. Please set up your environment variables.')
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },

  async signOut() {
    if (!supabase) {
      throw new Error('Supabase is not configured. Please set up your environment variables.')
    }
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    if (!supabase) {
      return null
    }
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }
}

export const progressService = {
  async saveProgress(userId: string, lessonId: string, score: number, timeSpent: number) {
    if (!supabase) {
      throw new Error('Supabase is not configured. Please set up your environment variables.')
    }
    const { data, error } = await supabase
      .from('user_progress')
      .insert({
        user_id: userId,
        lesson_id: lessonId,
        quiz_score: score,
        time_spent: timeSpent,
        completed_at: new Date().toISOString()
      })
    
    if (error) throw error
    return data
  },

  async getUserProgress(userId: string) {
    if (!supabase) {
      throw new Error('Supabase is not configured. Please set up your environment variables.')
    }
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getTopicProgress(userId: string, topic: string) {
    if (!supabase) {
      throw new Error('Supabase is not configured. Please set up your environment variables.')
    }
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .ilike('lesson_id', `%${topic}%`)
    
    if (error) throw error
    return data
  }
}