import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    transactions: [
      { id: 1, amount: 1500, description: 'Nákup', date: '2025-10-01' },
      { id: 2, amount: -500, description: 'Benzín', date: '2025-10-02' }
    ]
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    message: 'Transakce vytvořena',
    transaction: { id: 3, ...body }
  }, { status: 201 });
}