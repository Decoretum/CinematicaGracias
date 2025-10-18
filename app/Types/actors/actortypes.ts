import { Actor } from '../entitytypes'

export type CreateUpdateActor = Omit<Actor, 'id' | 'img'>;
