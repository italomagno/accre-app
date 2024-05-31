import "@/styles/globals.css"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
export const metadata = {
  title: 'shiftApp',
  description: 'Generated using Next.js',
  
}
import { Syne, Comfortaa } from 'next/font/google'
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
const syne = Syne({
  subsets: ['latin'],
  display: 'swap',
})

const comfortaa = Comfortaa({
  subsets: ['latin'],
  display: 'swap',
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);
  if(session)redirect("/lancamento")
  
  return (
    <html lang="en">
      <body className={`${syne.className} ${comfortaa.className}`}>{children}</body>
    </html>
  )
}

