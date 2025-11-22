'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function CreatePostForm({ userId }: { userId: string }) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 检查用户是否有 profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single()

      if (!profile) {
        // 如果没有 profile，创建一个
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            username: '用户',
            updated_at: new Date().toISOString(),
          })

        if (profileError) {
          console.error('Error creating profile:', profileError)
        }
      }

      const { data, error: insertError } = await supabase
        .from('posts')
        .insert({
          title: title.trim(),
          content: content.trim(),
          author_id: userId,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      // 跳转到文章详情页
      router.push(`/post/${data.id}`)
    } catch (err: any) {
      setError(err.message || '发布失败，请重试')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <div className="form-group">
        <label htmlFor="title">标题</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入文章标题..."
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="content">内容</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="输入文章内容..."
          required
        />
      </div>
      <button type="submit" className="submit-btn" disabled={loading || !title.trim() || !content.trim()}>
        {loading ? '发布中...' : '发布文章'}
      </button>
    </form>
  )
}

