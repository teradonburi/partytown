import { NextRequest, NextResponse } from 'next/server'

export const middleware = async (request: NextRequest) => {
  // reverse proxy
  if (request.nextUrl?.pathname?.startsWith('/proxy')) {
    const nextUrl = request.nextUrl.clone()
    const searchParam = new URLSearchParams(nextUrl.search)
    const pathname = nextUrl.pathname.replace(/^\/proxy/, '')
    const origin = searchParam.get('target_party_host')
    if (origin) {
      searchParam.delete('target_party_host')
      const query =
        searchParam.toString().length > 0 ? `?${searchParam.toString()}` : ''
      const url =
        'https://' + decodeURIComponent(origin) + (pathname ? pathname : '') + query
      try {
        const requestHeaders = new Headers(request.headers)

        console.log(url)
        return NextResponse.rewrite(new URL(url), {
          request: { headers: requestHeaders },
        })
      } catch (e) {
        if(e instanceof Error){
          console.warn(`reverse proxy failed: ${url}, ${e.toString()}`)
        }
      }
    }
  }

  return NextResponse.next()
}