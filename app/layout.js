import './globals.css'

export const metadata = {
  title: 'StoryVoice - Read Aloud & Record Stories',
  description: 'Practice reading aloud or record bedtime stories for your loved ones',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
