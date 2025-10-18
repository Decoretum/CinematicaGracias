import { Director } from '../entitytypes'

export type CreateUpdateDirector = Omit<Director, 'id' | 'img'>;
export type EditDirector = {
    directorId : number
}