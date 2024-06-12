import { NextRequest, NextResponse } from "next/server"

export default async function middleware(req: NextRequest) {
  const isAuthenticated = req.cookies.getAll().find((cookie) => cookie.name === "authjs.session-token")
  const allowedPaths = ['/', "/lancamento"]
  
  if (!isAuthenticated && !allowedPaths.includes(req.url) && !req.url.includes("/login")) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  if (isAuthenticated && req.url.includes("/login")) {
    return NextResponse.redirect(new URL('/lancamento', req.url))
  }
}

export const config = {
  matcher: ['/login', '/', "/lancamento"],
}
