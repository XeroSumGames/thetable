import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Geo parity with TheTapestry. The proxied generators' visit beacons read
// geo_* cookies (country/region/city/lat/lng) and geo_ip (hashed to ip_hash)
// to enrich the visit they post to the shared log-visit function. Those cookies
// are set here from Vercel's IP headers; without this middleware, thetable
// visits would log with null geo. Runs on the generator paths too (middleware
// executes before the next.config rewrite), so the cookies are present when the
// proxied page's beacon fires. Must match TheTapestry's middleware.
export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip') ?? ''
  if (ip) response.cookies.set('geo_ip', ip, { path: '/', sameSite: 'lax' })

  const country = request.headers.get('x-vercel-ip-country') ?? ''
  const region = request.headers.get('x-vercel-ip-country-region') ?? ''
  const city = request.headers.get('x-vercel-ip-city') ?? ''
  const lat = request.headers.get('x-vercel-ip-latitude') ?? ''
  const lng = request.headers.get('x-vercel-ip-longitude') ?? ''

  if (country) response.cookies.set('geo_country', country, { path: '/', sameSite: 'lax' })
  if (region) response.cookies.set('geo_region', region, { path: '/', sameSite: 'lax' })
  if (city) response.cookies.set('geo_city', decodeURIComponent(city), { path: '/', sameSite: 'lax' })
  if (lat) response.cookies.set('geo_lat', lat, { path: '/', sameSite: 'lax' })
  if (lng) response.cookies.set('geo_lng', lng, { path: '/', sameSite: 'lax' })

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|fonts/).*)'],
}
