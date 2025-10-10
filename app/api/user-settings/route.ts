import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../middleware/auth';

// PROTECTED ENDPOINT - Requires JWT token
export async function GET(request: NextRequest) {
  // Verify JWT token
  const payload = verifyToken(request);

  if (!payload) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid or missing token' },
      { status: 401 }
    );
  }

  // Return user-specific settings using userId from token
  return NextResponse.json({
    userId: payload.userId,
    username: payload.username,
    settings: {
      theme: 'dark',
      currency: 'CZK',
      notifications: true,
      language: 'cs'
    }
  });
}

// PROTECTED ENDPOINT - Requires JWT token
export async function PUT(request: NextRequest) {
  // Verify JWT token
  const payload = verifyToken(request);

  if (!payload) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid or missing token' },
      { status: 401 }
    );
  }

  const body = await request.json();

  return NextResponse.json({
    message: 'Nastavení aktualizováno',
    userId: payload.userId,
    settings: body
  });
}