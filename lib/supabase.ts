import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iistfncnfdrrrqkjivbj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlpc3RmbmNuZmRycnJxa2ppdmJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3OTg2NzksImV4cCI6MjA3OTM3NDY3OX0.B9Zxnm93SiueGIiJIh9R88_OGmIYR4RlpgaRs_an4B0'

// Supabase 客户端实例（客户端和服务端共用）
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// 服务端使用的 Supabase 客户端
// 在 Server Components 中，Supabase 客户端可以正常工作
export function createServerSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}

// 数据库类型定义
export interface Profile {
  id: string
  username: string
  avatar_url?: string
  updated_at: string
}

export interface Post {
  id: string
  created_at: string
  title: string
  content: string
  author_id: string
  profiles?: Profile
}

export interface Comment {
  id: string
  created_at: string
  content: string
  post_id: string
  commenter_id: string
  profiles?: Profile
}

