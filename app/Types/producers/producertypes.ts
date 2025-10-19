import { Producer } from '../entitytypes'

export type ProducerCreate = Omit<Producer, 'id' | 'img'>;
export type ProducerEdit = {
    directorId : number
}