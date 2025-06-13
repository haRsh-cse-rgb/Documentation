import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JobQuest - Find Your Dream Job',
  description: 'A curated job board platform with AI-powered CV analysis and personalized job recommendations.',
  keywords: 'jobs, careers, employment, job search, CV analysis, job board',
  authors: [{ name: 'JobQuest Team' }],
  openGraph: {
    title: 'JobQuest - Find Your Dream Job',
    description: 'A curated job board platform with AI-powered CV analysis and personalized job recommendations.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JobQuest - Find Your Dream Job',
    description: 'A curated job board platform with AI-powered CV analysis and personalized job recommendations.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
}