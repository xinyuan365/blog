# 个人播客网站

一个基于 Next.js 14 和 Supabase 的个人播客网站，支持文章发布、评论等功能。

## 功能特性

- 📝 **文章列表页** - 首页显示所有文章列表
- 📄 **文章详情页** - 查看文章内容和评论
- ✍️ **创建文章** - 登录用户可以发布新文章
- 💬 **评论功能** - 登录用户可以发表评论
- 🔐 **用户认证** - 基于 Supabase Auth 的登录/注册系统

## 技术栈

- **框架**: Next.js 14 (App Router)
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **样式**: CSS Modules
- **语言**: TypeScript

## 数据库结构

### profiles (用户信息表)
- `id` (uuid, Primary Key, Foreign Key → auth.users.id)
- `username` (text)
- `avatar_url` (text, 可选)
- `updated_at` (timestampz)

### posts (文章表)
- `id` (uuid, Primary Key)
- `created_at` (timestampz)
- `title` (text)
- `content` (text)
- `author_id` (uuid, Foreign Key → profiles.id)

### comments (评论表)
- `id` (uuid, Primary Key)
- `created_at` (timestampz)
- `content` (text)
- `post_id` (uuid, Foreign Key → posts.id)
- `commenter_id` (uuid, Foreign Key → profiles.id)

## 安装和运行

1. 安装依赖：
```bash
npm install
```

2. 运行开发服务器：
```bash
npm run dev
```

3. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
blog/
├── app/
│   ├── auth/
│   │   ├── login/          # 登录/注册页面
│   │   └── signout/        # 退出登录路由
│   ├── create/             # 创建文章页面
│   ├── post/
│   │   └── [id]/           # 文章详情页
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 首页（文章列表）
│   └── globals.css         # 全局样式
├── lib/
│   └── supabase.ts         # Supabase 客户端配置
└── package.json
```

## 使用说明

1. **注册/登录**: 访问 `/auth/login` 注册新账号或登录
2. **查看文章**: 在首页点击文章标题查看详情
3. **发布文章**: 登录后点击导航栏的"写文章"按钮
4. **发表评论**: 在文章详情页底部填写评论表单

## Supabase 配置

项目已配置 Supabase 连接信息：
- Project URL: `https://iistfncnfdrrrqkjivbj.supabase.co`
- Anon Key: 已配置在 `lib/supabase.ts` 中

请确保在 Supabase 控制台中：
1. 已创建上述三个数据表
2. 已设置正确的外键关系
3. 已配置 Row Level Security (RLS) 策略（如果需要）

## 开发

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

