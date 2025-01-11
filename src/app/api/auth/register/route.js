// src/app/api/auth/register/route.js
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import connectToDatabase from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { name, email, password, birthdate, role } = await req.json();

  if (!name || !email || !password || !birthdate || !role) {
    return NextResponse.json({ message: 'Todos los campos son obligatorios' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'El correo ya está registrado' }, { status: 409 });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      birthdate,
      role,
    });

    return NextResponse.json({ message: 'Usuario registrado exitosamente', userId: newUser._id }, { status: 201 });
  } catch (error) {
    console.error('Error en el registro:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
