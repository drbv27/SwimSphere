//src/app/api/auth/validate/route.js
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const body = await req.json();
    const token = body?.token;

    console.log('Cuerpo recibido:', body);
    console.log('Token recibido:', token);
    console.log('Clave JWT_SECRET:', JWT_SECRET);

    if (!token) {
      return NextResponse.json({ message: 'Token no proporcionado' }, { status: 401 });
    }

    // Decodificar el token para inspección
    const decoded = jwt.decode(token);
    console.log('Token decodificado:', decoded);

    // Intentar verificar el token
    const verified = jwt.verify(token, JWT_SECRET);
    console.log('Token verificado:', verified);

    return NextResponse.json({ valid: true, user: verified }, { status: 200 });
  } catch (error) {
    console.error('Error al verificar el token:', error.message);
    return NextResponse.json({ message: 'Acceso denegado' }, { status: 401 });
  }
}
