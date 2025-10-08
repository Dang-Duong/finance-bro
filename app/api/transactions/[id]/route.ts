import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({
    id: id,
    amount: 1500,
    description: 'Nákup v obchodě',
    date: '2025-10-01',
    category: 'Shopping'
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  return NextResponse.json({
    message: 'Transakce aktualizována',
    id: id,
    ...body
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({
    message: 'Transakce smazána',
    id: id
  });
}