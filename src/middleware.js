// src/middleware.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware to protect private routes.
 * - Allows public routes to bypass authentication.
 * - Validates JWT for private routes.
 */
export function middleware(req) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  const publicRoutes = ['/api/auth/register', '/api/auth/login', '/api/auth/validate'];
  const currentPath = req.nextUrl.pathname;

  // Allow public routes
  if (publicRoutes.includes(currentPath)) {
    return NextResponse.next();
  }

  if (!token) {
    return new Response(JSON.stringify({ message: 'Access denied' }), { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user info to request
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 });
  }

  return NextResponse.next();
}
