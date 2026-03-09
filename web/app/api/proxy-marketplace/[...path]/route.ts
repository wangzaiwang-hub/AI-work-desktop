import { NextRequest, NextResponse } from 'next/server'

const MARKETPLACE_API_BASE_URL = process.env.MARKETPLACE_API_URL || 'https://marketplace.dify.ai'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  return proxyRequest(request, path, 'GET')
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  return proxyRequest(request, path, 'POST')
}

async function proxyRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  const path = pathSegments.join('/')
  const searchParams = request.nextUrl.searchParams.toString()
  const targetUrl = `${MARKETPLACE_API_BASE_URL}/${path}${searchParams ? `?${searchParams}` : ''}`

  const headers = new Headers()
  request.headers.forEach((value, key) => {
    if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
      headers.set(key, value)
    }
  })

  // Add X-Dify-Version header for marketplace API
  headers.set('X-Dify-Version', '1.12.0')

  // 确保 Cookie 头被正确转发
  const cookies = request.cookies.getAll()
  if (cookies.length > 0) {
    const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ')
    headers.set('Cookie', cookieHeader)
  }

  let body: string | undefined
  if (method !== 'GET' && method !== 'HEAD') {
    try {
      body = await request.text()
    } catch (e) {
      // 忽略
    }
  }

  try {
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
      credentials: 'include',
    })

    const responseHeaders = new Headers()
    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase()
      // 跳过这些头：Set-Cookie 需要特殊处理，content-encoding 和 content-length 会导致解码错误
      if (lowerKey !== 'set-cookie' && lowerKey !== 'content-encoding' && lowerKey !== 'content-length') {
        responseHeaders.set(key, value)
      }
    })

    // 处理 Set-Cookie 头：移除 domain 和 secure 属性
    const setCookieHeaders = response.headers.getSetCookie?.() || []
    setCookieHeaders.forEach((cookie) => {
      let modifiedCookie = cookie
        .replace(/;\s*Domain=[^;]*/gi, '')
        .replace(/;\s*Secure\s*/gi, '')
      
      responseHeaders.append('Set-Cookie', modifiedCookie)
    })

    const responseBody = await response.arrayBuffer()

    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error('Marketplace proxy error:', error)
    return NextResponse.json(
      { error: 'Marketplace proxy request failed' },
      { status: 500 }
    )
  }
}
