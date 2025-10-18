import { Film } from "../entitytypes";

export type CreateUpdateFilm = Omit<Film, 'id' | 'img' | 'average_user_rating'>;