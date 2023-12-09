import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import { ThemeProvider } from '../components/providers/ThemeProvider'
import { cn } from '../lib/utils'
import './globals.css'
import ModalProvider from '../components/providers/ModalProvider'
import { SocketProvider } from '../components/providers/SocketProvider'
import { QueryProvider } from '../components/providers/QueryProvider'
import CommonLayout from '../rediscord-components/layout/common-layout'

const font = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Discord-Cloned',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        {/*<body className={cn(font?.className, 'bg-white dark:bg-[#313338]')}>*/}
        <body className={font?.className + ' dark'}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="discord-theme"
          >
            <SocketProvider>
              <ModalProvider />
              <QueryProvider>
                <CommonLayout />
                {children}
              </QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
