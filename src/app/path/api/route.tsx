import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'GET request successful' });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Simple validations
    if (!data.name || typeof data.name !== 'string') {
      return NextResponse.json({ error: 'Name is required and must be a string' }, { status: 400 });
    }

    if (!data.email || typeof data.email !== 'string' || !/^\S+@\S+\.\S+$/.test(data.email)) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
    }

    if (!data.age || typeof data.age !== 'number' || data.age <= 0) {
      return NextResponse.json({ error: 'Age is required and must be a positive number' }, { status: 400 });
    }

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
