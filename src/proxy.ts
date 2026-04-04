import authConfig from "./auth.config"
import NextAuth from "next-auth"
import { NextResponse } from "next/server"

// We use the light-weight NextAuth instance for the proxy layer 
// to avoid heavy database initializations (Prisma) on every request.
const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isPublicRoute = ["/", "/login", "/register"].includes(nextUrl.pathname)
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard") || nextUrl.pathname.startsWith("/finance") || nextUrl.pathname.startsWith("/class")
  const isAuthRoute = ["/login", "/register"].includes(nextUrl.pathname)

  if (isApiAuthRoute) return NextResponse.next()

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }
    return NextResponse.next()
  }

  if (!isLoggedIn && isDashboardRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
