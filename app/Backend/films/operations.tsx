import { FilmGenres } from "@/app/Helpers/FilmGenres";
import { ParseDataResult } from "@/app/Types/entitytypes";
import { CreateUpdateFilm, FilmGenre } from "@/app/Types/films/filmtypes";
import { SupabaseClient } from "@supabase/supabase-js";

export default function operations(client : SupabaseClient) {

    const parseData = (obj: CreateUpdateFilm) : ParseDataResult => {

        // Data Validation

        // Name

        let hashmap : ParseDataResult = {
            result: "",
            metadata: {}
        };
        
        const validName = (name : string) => {
            let formattedName = name.replace(/\s+/g, '');
            return name.replace(/\s+/g, '').length >= 3 && /\d/.test(formattedName) === false;
        }

        if (!validName(obj.name)) {
            hashmap['result'] = 'Film name must have at least 3 charactes';
            return hashmap;
        } 

        // Genres
        // Import Enums

        if (obj.genres.length === 0) {
            hashmap['result'] = 'Film must have at least 1 genre';
            return hashmap;
        }

        for (let i = 0; i <= obj.genres.length - 1; i++) {
            let genre : FilmGenre = obj.genres[i].toUpperCase() as FilmGenre;
            if (!FilmGenres.includes(genre)) {
                hashmap['result'] = 'One of the genre values isn\'t part of the standard accepted genres';
                return hashmap;
            }
        }

        // Date Released
        // Assuming that date_released is formatted as YYYY-MM-DD

        let dateReleased = new Date(obj.date_released);
        let currDate = new Date();
        if (dateReleased > currDate) {
            hashmap['result'] = 'Film\'s released date cannot be ahead than the current date';
            return hashmap;
        }

    
        hashmap['result'] = 'success';
        return hashmap;
    }

    const getFilms = async () : Promise<any | null> => {
        const films = client.from('film').select();
        return films;
    }
    
    const createFilm = async (obj: CreateUpdateFilm) => {

        let result = parseData(obj);
        if (result['result'] !== 'success') return result;

        const { error } = await client
        .from('producer')
        .insert({obj});
        
        return { error }
    }

    const updateFilm = async (filmId : number, obj: CreateUpdateFilm, hm : Map<string, Object>) => {
        let result = parseData(obj);
        if (result['result'] !== 'success') return result;

        let updatedData : any = {};
        for (const [key, value] of hm) {
            updatedData[key] = value;
        }

        const { error } = await client
        .from('film')
        .update({updatedData})
        .eq('id', filmId)

        return { error };
    }

    const deleteFilm = async (filmId : number) => {
        const response = await client
        .from('film')
        .delete()
        .eq('id', filmId)

        return { response }
    }

    return { getFilms, createFilm, updateFilm, deleteFilm }
}