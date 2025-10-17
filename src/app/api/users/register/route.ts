import { NextRequest, NextResponse } from 'next/server';

// Mock API endpoint for user registration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basit validation
    if (!body.fullName || !body.email || !body.password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (body.password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Simulated delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulated success response
    console.log('Registration successful:', body);
    
    return NextResponse.json(
      { 
        message: 'Account created successfully!',
        user: {
          id: Math.random().toString(36).substr(2, 9),
          fullName: body.fullName,
          email: body.email
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}