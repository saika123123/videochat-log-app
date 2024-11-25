import './globals.css'

export const metadata = {
  title: 'Meeting Chat',
  description: '会議の議事録アプリ',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}