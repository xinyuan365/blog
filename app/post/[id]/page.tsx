import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase'
import { Post, Comment, Profile } from '@/lib/supabase'
import CommentForm from './CommentForm'

// 强制动态渲染，确保数据实时更新
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getPost(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !post) {
    return null
  }

  // 获取作者信息
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .eq('id', post.author_id)
    .single()

  return {
    ...post,
    profiles: profile || null
  } as Post & { profiles: Profile | null }
}

async function getComments(postId: string) {
  const supabase = await createServerSupabaseClient()
  const { data: comments, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error || !comments) {
    console.error('Error fetching comments:', error)
    return []
  }

  // 获取所有评论者信息
  const commenterIds = Array.from(new Set(comments.map(c => c.commenter_id)))
  let profiles: Profile[] = []
  
  if (commenterIds.length > 0) {
    const { data } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .in('id', commenterIds)
    
    profiles = data || []
  }

  // 将评论者信息关联到评论
  const commentsWithProfiles = comments.map(comment => ({
    ...comment,
    profiles: profiles.find(p => p.id === comment.commenter_id) || null
  }))

  return commentsWithProfiles as (Comment & { profiles: Profile | null })[]
}

export default async function PostDetail({
  params,
}: {
  params: { id: string }
}) {
  const post = await getPost(params.id)
  const comments = await getComments(params.id)

  if (!post) {
    notFound()
  }

  return (
    <div>
      <article className="post-detail">
        <h1>{post.title}</h1>
        <div className="post-author">
          作者: {post.profiles?.username || '未知'} ·{' '}
          {new Date(post.created_at).toLocaleString('zh-CN')}
        </div>
        <div className="post-content">{post.content}</div>
      </article>

      <section className="comments-section">
        <h2>评论 ({comments.length})</h2>
        
        <CommentForm postId={params.id} />

        <div className="comments-list">
          {comments.length === 0 ? (
            <div className="empty-state">
              <p>还没有评论，快来发表第一条吧！</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-content">{comment.content}</div>
                <div className="comment-meta">
                  {comment.profiles?.username || '未知'} ·{' '}
                  {new Date(comment.created_at).toLocaleString('zh-CN')}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

