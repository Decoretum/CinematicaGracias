import { Producer } from '../entitytypes'

export type CreateUpdateProducer = Omit<Producer, 'id' | 'img' | 'film_pk'>;
