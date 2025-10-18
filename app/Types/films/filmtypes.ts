import { FilmGenres } from "@/app/Helpers/FilmGenres";
import { Film } from "../entitytypes";

export type CreateUpdateFilm = Omit<Film, 'id' | 'img' | 'average_user_rating' | 'genres'> & {
    genres: Array<FilmGenre>
};
export type FilmGenre = typeof FilmGenres[number];