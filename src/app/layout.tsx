import "@/styles/globals.css"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
export const metadata = {
  title: 'shiftApp',
  description: 'Generated using Next.js',
  
}
import styles from "@/components/login.module.css"
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
    <html lang="pt" style={{ width:"100%",height:"fit-content", margin:"auto"}}>
      <body className={`${comfortaa.className} ${syne.className} ${styles.body}`} >{children}</body>
    </html>
  )
}

