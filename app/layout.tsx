import './globals.css'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: 'Consulta paradero',
  description: 'Página para consultar en cuanto llega la micro al paradero consumiendo la API de Red.',
  authors: {name: 'Diego Ramirez', url:'https://diegoramirez.vercel.app'},
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head/>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
