'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function CommentForm({ postId }: { postId: string }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // 获取当前用户
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setError('请先登录才能发表评论')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {

      // 检查用户是否有 profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!profile) {
        // 如果没有 profile，创建一个
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            username: user.email?.split('@')[0] || '用户',
            updated_at: new Date().toISOString(),
          })

        if (profileError) {
          console.error('Error creating profile:', profileError)
        }
      }

      const { error: insertError } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          content: content.trim(),
          commenter_id: user.id,
          created_at: new Date().toISOString(),
        })

      if (insertError) {
        throw insertError
      }

      setContent('')
      setSuccess(true)
      
      // 刷新页面以显示新评论
      // 使用 setTimeout 确保数据已写入数据库
      setTimeout(() => {
        router.refresh()
      }, 300)
    } catch (err: any) {
      setError(err.message || '发表评论失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="comment-form">
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          请先<Link href="/auth/login" style={{ color: '#2563eb' }}>登录</Link>才能发表评论
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      {error && <div className="error">{error}</div>}
      {success && <div className="success">评论发表成功！</div>}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="写下你的评论..."
        required
      />
      <button type="submit" disabled={loading || !content.trim()}>
        {loading ? '发表中...' : '发表评论'}
      </button>
    </form>
  )
}

