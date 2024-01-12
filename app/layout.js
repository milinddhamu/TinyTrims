import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })
export const metadata = {
  title: 'Tiny trims',
  description: 'Trim to tiny a url from something humongous.',
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({ children , session }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
      <SessionProvider session={session}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
          <main>
            {children}
            </main>
          <Toaster />
          </ThemeProvider>
      </SessionProvider>
          </body>
    </html>
  )
}
