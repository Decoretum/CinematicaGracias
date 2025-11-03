import { AuthError } from '@supabase/supabase-js';
import { Users } from '../entitytypes'

export type BaseOperationUser = Omit<Users, 'id'> & {
    id?: string,
    email: string,
    password: string
}
export type SignUpUser = BaseOperationUser;
export type EditUser = Omit<BaseOperationUser, 'is_admin'> & {
    samePassword: boolean
}
export type SignOutUser = {
    sessionId: string,
    userId: string
}
export type LoginUser = {
    data: {
        error : AuthError
    }
}
