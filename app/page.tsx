import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase'
import { Post, Profile } from '@/lib/supabase'

// 强制动态渲染，确保数据实时更新
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getPosts() {
  const supabase = await createServerSupabaseClient()
  
  // 先获取所有文章
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (postsError || !posts) {
    console.error('Error fetching posts:', postsError)
    return []
  }

  // 获取所有作者信息
  const authorIds = [...new Set(posts.map(p => p.author_id))]
  let profiles: Profile[] = []
  
  if (authorIds.length > 0) {
    const { data } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .in('id', authorIds)
    
    profiles = data || []
  }

  // 将作者信息关联到文章
  const postsWithProfiles = posts.map(post => ({
    ...post,
    profiles: profiles.find(p => p.id === post.author_id) || null
  }))

  return postsWithProfiles as (Post & { profiles: Profile | null })[]
}

export default async function Home() {
  const posts = await getPosts()

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>最新文章</h1>
      {posts.length === 0 ? (
        <div className="empty-state">
          <p>还没有文章，快来发布第一篇吧！</p>
        </div>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <article key={post.id} className="post-card">
              <h2>
                <Link href={`/post/${post.id}`}>{post.title}</Link>
              </h2>
              <div className="post-meta">
                <span>作者: {post.profiles?.username || '未知'}</span>
                <span style={{ marginLeft: '1rem' }}>
                  {new Date(post.created_at).toLocaleString('zh-CN')}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

