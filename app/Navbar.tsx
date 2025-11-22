'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 获取当前用户
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="logo">
          个人播客
        </Link>
        <div className="nav-links">
          <Link href="/">首页</Link>
          {!loading && (
            <>
              {user ? (
                <>
                  <Link href="/create">写文章</Link>
                  <span className="user-info">{user.email}</span>
                  <button onClick={handleSignOut} className="btn-link">
                    退出
                  </button>
                </>
              ) : (
                <Link href="/auth/login">登录</Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

