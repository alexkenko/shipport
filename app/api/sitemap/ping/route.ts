import { NextResponse } from 'next/server'

const GOOGLE_PING = 'https://www.google.com/ping?sitemap='
const BING_PING = 'https://www.bing.com/ping?sitemap='

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shipinport.com'
  const sitemapUrl = `${baseUrl}/sitemap.xml`

  try {
    const [g, b] = await Promise.all([
      fetch(`${GOOGLE_PING}${encodeURIComponent(sitemapUrl)}`),
      fetch(`${BING_PING}${encodeURIComponent(sitemapUrl)}`),
    ])

    return NextResponse.json({ ok: true, google: g.status, bing: b.status })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'ping failed' }, { status: 500 })
  }
}


