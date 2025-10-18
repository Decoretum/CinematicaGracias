import { FilmActor } from "../entitytypes";

export type CreateUpdateFilmActor = Omit<FilmActor, 'id'>;