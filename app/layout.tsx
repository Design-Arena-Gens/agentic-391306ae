import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Sales Agent - Automated Customer Service',
  description: 'AI-powered sales agent with personalized messaging and sales psychology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
