import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    userId: 1,
    settings: {
      theme: 'dark',
      currency: 'CZK',
      notifications: true,
      language: 'cs'
    }
  });
}

export async function PUT(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    message: 'Nastavení aktualizováno',
    settings: body
  });
}