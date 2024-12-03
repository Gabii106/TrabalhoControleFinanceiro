import './globals.css'
import { Inter } from 'next/font/google'
import Header from './components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Financial Management System',
  description: 'Manage your finances with ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}

