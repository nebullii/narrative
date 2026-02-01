import './globals.css'

export const metadata = {
  title: 'Narratai - Interactive Storytelling',
  description: 'A calm, meaningful reading experience',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
