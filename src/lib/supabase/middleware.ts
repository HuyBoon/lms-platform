import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // 1. Protected routes check
  if (
    !user &&
    !url.pathname.startsWith('/login') &&
    !url.pathname.startsWith('/register') &&
    !url.pathname.startsWith('/auth') &&
    url.pathname !== '/'
  ) {
    // no user, potentially respond by redirecting the user to the login page
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 2. Role-based check (once user is logged in)
  if (user) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = userData?.role

    // Redirect logged-in users away from auth pages
    if (url.pathname.startsWith('/login') || url.pathname.startsWith('/register')) {
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    // Role specific route protection
    if (url.pathname.includes('/teacher') && role !== 'teacher' && role !== 'admin') {
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
    
    if (url.pathname.includes('/admin') && role !== 'admin') {
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
