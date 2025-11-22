'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// 预设账号
const PRESET_ACCOUNTS = [
  { email: '123@gmail.clm', password: '123', label: '账号 1' },
  { email: '1234@gmail.com', password: '1234', label: '账号 2' },
  { email: '12345@gmail.com', password: '12345', label: '账号 3' },
]

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (email: string, password: string) => {
    setLoading(email)
    setError(null)

    try {
      // 先尝试登录
      let { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      // 如果登录失败，尝试注册账号
      if (signInError) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        })

        if (signUpError) {
          throw signUpError
        }

        signInData = signUpData
      }

      // 确保用户有 profile
      const user = signInData?.user
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single()

        if (!profile) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              username: email.split('@')[0],
              updated_at: new Date().toISOString(),
            })

          if (profileError) {
            console.error('Error creating profile:', profileError)
          }
        }
      }

      router.push('/')
      router.refresh()
    } catch (err: any) {
      // 如果是密码长度错误，提供更友好的提示
      if (err.message?.includes('Password should be at least 6 characters')) {
        setError('密码长度限制：需要在 Supabase 控制台的 Authentication 设置中修改密码策略。请查看 SUPABASE_PASSWORD_SETTINGS.md 文件了解详细步骤。')
      } else {
        setError(err.message || '登录失败，请重试')
      }
      setLoading(null)
    }
  }

  return (
    <div className="auth-container">
      <h1>登录</h1>
      {error && <div className="error" style={{ marginBottom: '1rem' }}>{error}</div>}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {PRESET_ACCOUNTS.map((account) => (
          <button
            key={account.email}
            onClick={() => handleLogin(account.email, account.password)}
            className="submit-btn"
            disabled={loading !== null}
            style={{
              width: '100%',
              opacity: loading !== null && loading !== account.email ? 0.6 : 1,
            }}
          >
            {loading === account.email ? '登录中...' : `${account.label} (${account.email})`}
          </button>
        ))}
      </div>
    </div>
  )
}

