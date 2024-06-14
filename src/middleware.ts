
import { NextRequest, NextResponse } from "next/server"

export default async function middleware(req: NextRequest) {
  const isAuthenticated = req.cookies.getAll().find((cookie) => cookie.name === "authjs.session-token")

  
  

  const allowedPaths = ['/', "/lancamento/*"]
  if (!isAuthenticated && !allowedPaths.includes(req.url) && !req.url.includes("/login")) {
    const loginURL = new URL('/login', req.url)
    return NextResponse.redirect(loginURL)
  }
  
  if (isAuthenticated && req.url.includes("/login")) {
    const firstUrl = new URL(`/lancamento`, req.url)
    return NextResponse.redirect(firstUrl)
  }
}

export const config = {
  matcher: ['/login', '/', "/lancamento"],
}
