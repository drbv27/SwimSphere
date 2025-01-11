// src/app/api/auth/validate/route.js
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import connectToDatabase from '@/lib/db';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ message: 'Token not provided' }, { status: 401 });
    }

    await connectToDatabase();
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ valid: true, user }, { status: 200 });
  } catch (error) {
    console.error('Token validation error:', error.message);
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}
