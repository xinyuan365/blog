import './globals.css'
import Navbar from './Navbar'

export const metadata = {
  title: '个人播客',
  description: '我的个人播客网站',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <Navbar />
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  )
}

