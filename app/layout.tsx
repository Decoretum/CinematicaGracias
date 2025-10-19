import './globals.css'

export const metadata = {
  title: 'Cinematica Gracias',
  description: 'Developed using NextJS and Supabase',
  icons: {
    icon: '/cinema.ico'
  }
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
