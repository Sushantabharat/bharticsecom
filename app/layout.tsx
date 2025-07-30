import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/header/header'
import Footer from '@/components/footer/footer'
import Providers from '@/components/Providers'
import DrawerButton from '@/components/DrawerButton'
import Sidebar from '@/components/Sidebar'
import { SessionProvider } from 'next-auth/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title:
    'Online store in India for new car, used car, exchange and more- carbhartics.com',
  description:
    'Buy New Car and Exchange Existing Car and Get Faster Delivery | Tech Profession and entrepreneur and person with 750 credit sroce ',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Providers>
            <div className="drawer">
              <DrawerButton />
              <div className="drawer-content">
                <div className="min-h-screen flex flex-col">
                  <Header />
                  {children}
                  <footer>
                    <Footer />
                  </footer>
                </div>
              </div>
              <div className="drawer-side">
                <label
                  htmlFor="my-drawer"
                  aria-label="close sidebar"
                  className="drawer-overlay"
                ></label>
                <Sidebar />
              </div>
            </div>
          </Providers>
        </SessionProvider>
      </body>
    </html>
  )
}
