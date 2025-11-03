import { supabaseAdmin } from '../../Backend/createAuthClient'
import { NextResponse } from 'next/server'

export async function GET() {
    let { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    return NextResponse.json({ users: users });
}