import { ParseDataResult } from "@/app/Types/entitytypes";
import { CreateUpdateFilm } from "@/app/Types/films/filmtypes";
import { SupabaseClient } from "@supabase/supabase-js";
import filmActorOperation from '../filmactors/operation';
import filmProducerOperation from '../filmproducers/operation';

export default function operations(client : SupabaseClient) {
    let { createFilmActor } = filmActorOperation(client);
    let { createFilmProducer } = filmProducerOperation(client);
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

        // Date Released
        // Assuming that date_released is formatted as YYYY-MM-DD

        let dateReleased = new Date(obj.date_released);
        let currDate = new Date();
        if (dateReleased > currDate) {
            hashmap['result'] = 'Film\'s released date cannot be ahead than the current date';
            return hashmap;
        }

        // Actors, Directors, and Producers
        // They must all have at least 1

        let missingActor = obj.actors.length === 0;
        if (missingActor) {
            hashmap['result'] = 'The film must have at least 1 actor';
            return hashmap;
        }

        let missingProducer = obj.producers.length === 0;
        if (missingProducer) {
            hashmap['result'] = 'The film must have at least 1 producer';
            return hashmap;
        }

        let missingDirector = obj.actors.length === 0;
        if (missingDirector) {
            hashmap['result'] = 'The film must have at least 1 director';
            return hashmap;
        }

        // Description
        // Must have at least 100 characters

        if (obj.description.length < 100) {
            hashmap['result'] = 'Description must have at least 100 characters';
            return hashmap;
        }

        // Duration & Framerate

        if (obj.duration < 0 || obj.duration === null) {
            hashmap['result'] = 'Film duration is invalid';
            return hashmap;
        }

        if (obj.frame_rate !== null && obj.frame_rate < 0) {
            hashmap['result'] = 'Film frame_rate is invalid';
            return hashmap;
        }

        hashmap['result'] = 'success';
        return hashmap;
    }

    const getFilms = async () : Promise<any | null> => {
        const films = client.from('film').select();
        return films;
    }
    
    const createFilm = async (obj: CreateUpdateFilm) : Promise<ParseDataResult> => {

        let result = parseData(obj);
        let response : ParseDataResult = {result: '', metadata: {}};
        if (result['result'] !== 'success') return result;

        const { data } = await client
        .from('film')
        .insert({content_rating : obj.content_rating, date_released: obj.date_released, 
            description: obj.description, director_fk: obj.director_fk,
            duration: obj.duration, frame_rate: obj.frame_rate,
            genres: obj.genres, name: obj.name
         })
         .select()
         .single();

        for (let i = 0; i <= obj.producers.length - 1; i++) {
            await createFilmProducer(obj.producers[i], data.id);
        }

        for (let i = 0; i <= obj.actors.length - 1; i++) {
            await createFilmActor(obj.producers[i], data.id);
        }        
        
        response['result'] = 'success';
        return response
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