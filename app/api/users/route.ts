import { authClient } from '../../Backend/createAuthClient'
import { NextResponse } from 'next/server'

export async function GET() {
    let { data: { users }, error } = await authClient.listUsers();
    return NextResponse.json({ users: users });

}