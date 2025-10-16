import { createClient } from '@supabase/supabase-js'

// Supabase配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 数据库表名常量
export const TABLES = {
  POEMS: 'poems',
  AUTHORS: 'authors',
  CATEGORIES: 'categories'
}

// 错误处理工具函数
export const handleSupabaseError = (error, defaultMessage = '操作失败') => {
  console.error('Supabase错误:', error)
  throw new Error(error.message || defaultMessage)
}

export default supabase