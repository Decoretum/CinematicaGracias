import { supabaseAdmin } from '../../../Backend/createAuthClient'
import { NextResponse } from 'next/server'

type dto = {
    email?: string,
    password?: string
}

export async function PUT(request: Request) {
    const { userId, email, password } = await request.json();
    let obj : dto = {};
    if (email !== null) obj['email'] = email;
    if (password !== null) obj['password'] = password;

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, obj);
    return NextResponse.json({ data, error });
}