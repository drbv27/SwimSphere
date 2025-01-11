// src/middleware.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function middleware(req) {
    const token = req.headers.get('authorization')?.split(' ')[1];
  const publicRoutes = ['/api/auth/register', '/api/auth/login',, '/api/auth/validate']; // Rutas que no requieren autenticación
  const currentPath = req.nextUrl.pathname;

  // Permitir acceso a rutas públicas
  if (publicRoutes.includes(currentPath)) {
    return NextResponse.next();
  }


  if (!token) {
    return new Response(JSON.stringify({ message: 'Acceso denegado' }), { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Añadir datos del usuario a la solicitud
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Token inválido' }), { status: 401 });
  }

  return NextResponse.next();
}
