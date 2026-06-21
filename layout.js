export const metadata = {
  title: 'PromptMart',
  description: 'AI Prompt Marketplace',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
