"use server"

import { auth } from "../app/auth"

export default auth(async (req) => {
    if (!req.auth && req.nextUrl.pathname !== "/login") {
      const newUrl = new URL("/login", req.nextUrl.origin)
      return Response.redirect(newUrl)
    }
  })