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
