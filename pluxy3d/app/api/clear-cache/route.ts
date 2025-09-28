import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Note: This endpoint provides cache clearing functionality
    // Client-side cache (apiFetch cache) must be cleared on the client side using clearApiCache()
    // This endpoint could be used for server-side cache invalidation if implemented

    return NextResponse.json({
      success: true,
      message: 'Cache clear endpoint called. Note: Client-side cache must be cleared using clearApiCache() function.',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in clear-cache endpoint:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to clear cache' },
      { status: 500 }
    )
  }
}

// Also allow GET for convenience
export async function GET() {
  return POST()
}