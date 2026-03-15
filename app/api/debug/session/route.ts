
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

import { headers } from 'next/headers'

export async function GET() {
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const session = await auth.api.getSession({
        headers: await headers(),
    })

    return NextResponse.json(session)
}

