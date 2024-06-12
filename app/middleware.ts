/* import { AuthOption } from "./auth"
import NextAuth from "next-auth"
import { NextRequest } from "next/server"

const { auth } = NextAuth(AuthOption)
export default auth(async function middleware(req: NextRequest) {
    console.log(req)
})

export const config = {
    matcher: ['/login', '/', '/lancamento'],
  } */

/*   import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
    console.log(request)
  if (request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.rewrite(new URL('/about-2', request.url))
  }
 
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.rewrite(new URL('/dashboard/user', request.url))
  }
} */
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // Example middleware logic
  console.log('Middleware is running!');
  return NextResponse.next();
}
export const config = {
  matcher: '/login',
}
