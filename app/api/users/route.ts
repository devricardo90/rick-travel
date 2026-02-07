
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(users)
}

export async function POST(req: Request) {
  const body = await req.json()

  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''

  if (!name || !email) {
    return NextResponse.json(
      { error: 'Campos obrigatórios: name, email' },
      { status: 400 }
    )
  }

  try {
    const created = await prisma.user.create({
      data: { name, email },
    })
    return NextResponse.json(created, { status: 201 })
  } catch (err: any) {
    // email unique constraint
    if (err?.code === 'P2002') {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 })
  }
}
