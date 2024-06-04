import { Inter } from 'next/font/google'

import 'normalize.css/normalize.css'
import 'reactflow/dist/style.css'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Smart Vulnerabilities',
  description: 'Smart Vulnerabilities'
}

export default function RootLayout ({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className} suppressHydrationWarning>
        <div className='flex items-stretch max-h-screen min-h-screen overflow-hidden'>
          {children}
        </div>
      </body>
    </html>
  )
}
