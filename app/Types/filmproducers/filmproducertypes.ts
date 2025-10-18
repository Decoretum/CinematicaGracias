import { FilmProducer } from "../entitytypes";

export type CreateUpdateFilmProducer = Omit<FilmProducer, 'id'>;