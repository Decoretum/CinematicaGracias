import { FilmGenres } from "@/app/Helpers/FilmGenres";
import { Film } from "../entitytypes";

export type FilmCreate = Omit<Film, 'id' | 'img' | 'average_user_rating'> & {
    actors: Array<number>
    producers: Array<number>
};

export type FilmUpdate = FilmCreate & {
    old_actors: Array<number>
    old_producers: Array<number>
}

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
export type FilmDisplay = {
    name: string,
    average_user_rating: number | null,
    content_rating: string | null,
    date_released: string,
    duration: number
}
export type FilmHashmap = Map<string, Array<object>>;