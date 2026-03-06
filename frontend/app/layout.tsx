import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PreLegal - Mutual NDA Generator',
  description: 'Generate Mutual Non-Disclosure Agreements instantly',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
