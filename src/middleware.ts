
import { NextResponse } from "next/server"
import { auth } from "./lib/auth"

export default auth((req )=> {
  const isAuthenticated = req.auth

  const allowedPaths = ['/', "/lancamento", "/settings" ]
  if (!isAuthenticated && !allowedPaths.includes(req.url) && !req.url.includes("/login")) {
    const loginURL = new URL('/login', req.url)
    return NextResponse.redirect(loginURL)
  }
  
  if (isAuthenticated && req.url.includes("/login")) {
    const firstUrl = new URL(`/lancamento`, req.url)
    return NextResponse.redirect(firstUrl)
  }


})

export const config = {
  matcher: ['/login', '/', "/lancamento","/settings/:path*"],
}
