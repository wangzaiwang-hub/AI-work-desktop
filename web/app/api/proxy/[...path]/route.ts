import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  return proxyRequest(request, path, 'PUT')
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  return proxyRequest(request, path, 'DELETE')
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  return proxyRequest(request, path, 'PATCH')
}

async function proxyRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  const path = pathSegments.join('/')
  const searchParams = request.nextUrl.searchParams.toString()
  const targetUrl = `${API_BASE_URL}/${path}${searchParams ? `?${searchParams}` : ''}`

  // 复制请求头，包括 cookies
  const headers = new Headers()
  request.headers.forEach((value, key) => {
    // 跳过一些不需要的头
    if (!['host', 'connection'].includes(key.toLowerCase())) {
      headers.set(key, value)
    }
  })

  // 确保 Cookie 头被正确转发
  const cookies = request.cookies.getAll()
  if (cookies.length > 0) {
    const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ')
    headers.set('Cookie', cookieHeader)
    console.log(`[Proxy ${method} ${path}] Forwarding cookies:`, cookies.map(c => c.name).join(', '))
    
    // 特别检查 refresh-token 请求
    if (path.includes('refresh-token')) {
      console.log(`[Proxy ${method} ${path}] Cookie header:`, cookieHeader.substring(0, 200))
    }
  } else {
    console.log(`[Proxy ${method} ${path}] No cookies to forward`)
  }

  // 获取请求体
  let body: string | undefined
  if (method !== 'GET' && method !== 'HEAD') {
    try {
      body = await request.text()
    } catch (e) {
      // 忽略没有 body 的情况
    }
  }

  try {
    // 转发请求到后端
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
      credentials: 'include',
    })

    // 创建响应，保留所有头（包括 Set-Cookie）
    const responseHeaders = new Headers()
    response.headers.forEach((value, key) => {
      // 跳过 Set-Cookie，我们需要特殊处理
      if (key.toLowerCase() !== 'set-cookie') {
        responseHeaders.set(key, value)
      }
    })

    // 处理 Set-Cookie 头：移除 domain 和 secure 属性，确保 cookie 在 localhost:3000 上工作
    const setCookieHeaders = response.headers.getSetCookie?.() || []
    if (setCookieHeaders.length > 0) {
      console.log(`[Proxy ${method} ${path}] Received ${setCookieHeaders.length} Set-Cookie headers`)
    }
    setCookieHeaders.forEach((cookie) => {
      // 移除 Domain 和 Secure 属性，保留其他属性
      let modifiedCookie = cookie
        .replace(/;\s*Domain=[^;]*/gi, '') // 移除 Domain
        .replace(/;\s*Secure\s*/gi, '')    // 移除 Secure (localhost 不是 HTTPS)
      
      console.log(`[Proxy ${method} ${path}] Set-Cookie:`, modifiedCookie.split(';')[0])
      responseHeaders.append('Set-Cookie', modifiedCookie)
    })

    // 获取响应体
    const responseBody = await response.arrayBuffer()

    // 返回响应，确保 cookies 被传递
    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Proxy request failed' },
      { status: 500 }
    )
  }
}
