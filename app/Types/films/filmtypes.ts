import { FilmGenres } from "@/app/Helpers/FilmGenres";
import { Film } from "../entitytypes";

export type CreateUpdateFilm = Omit<Film, 'id' | 'img' | 'average_user_rating' | 'genres'> & {
    genres: Array<string>,
    actors: Array<number>,
    producers: Array<number>
};
export type FilmGenre = typeof FilmGenres[number];
export type IngestData = {
    id: number,
    name: string,
    checked: number
}
export type Genre = {
    id: number,
    name: string,
    checked: number
}