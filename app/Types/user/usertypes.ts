import { Users } from '../entitytypes'

export type signUpUser = Omit<Users, 'id' | 'birthday'> & {
    email: string,
    password: string,
    birthday: string
};
export type editUser = Omit<Users, 'id' | 'birthday'> & {
    email: string,
    password: string,
    birthday: string
};