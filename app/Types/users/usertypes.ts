import { AuthError } from '@supabase/supabase-js';
import { Users } from '../entitytypes'

export type SignUpEditUser = Omit<Users, 'id' | 'birthday'> & {
    email: string,
    password: string,
    birthday: string
};
export type SignOutUser = {
    sessionId: string,
    userId: string
}
export type LoginUser = {
    data: {
        error : AuthError
    }
}
