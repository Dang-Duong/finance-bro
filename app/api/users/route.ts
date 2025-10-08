import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    users: [
      { id: 1, name: 'Jan Novák', email: 'jan@example.com' },
      { id: 2, name: 'Petra Svobodová', email: 'petra@example.com' }
    ]
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    message: 'Uživatel vytvořen',
    user: { id: 3, ...body }
  }, { status: 201 });
}