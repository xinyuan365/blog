'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import CreatePostForm from './CreatePostForm'
import type { User } from '@supabase/supabase-js'

export default function CreatePost() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/auth/login')
      } else {
        setUser(user)
        setLoading(false)
      }
    })
  }, [router])

  if (loading || !user) {
    return <div className="loading">加载中...</div>
  }

  return (
    <div className="create-form">
      <h1>创建新文章</h1>
      <CreatePostForm userId={user.id} />
    </div>
  )
}

