import { Director } from '../entitytypes'

export type DirectorCreateUpdate = Omit<Director, 'id' | 'img'>;
export type DirectorEdit = {
    directorId : number
}