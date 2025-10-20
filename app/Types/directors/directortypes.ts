import { Director } from '../entitytypes'

export type DirectorCreateUpdate = Omit<Director, 'id' | 'img'>;
export type DirectorEdit = {
    directorId : number
}
export type DirectorDisplay = {
    first_name: string,
    last_name: string,
    birthday: string
}