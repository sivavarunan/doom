import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'GET request successful' });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Process the data (e.g., save to a database)
    return NextResponse.json({ message: 'POST request successful', data });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    // Process the data (e.g., update an existing resource)
    return NextResponse.json({ message: 'PUT request successful', data });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    // Perform delete operation
    return NextResponse.json({ message: 'DELETE request successful' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 400 });
  }
}
