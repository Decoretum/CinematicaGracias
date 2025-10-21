import { CreateUpdateFilmActor } from "@/app/Types/filmactors/filmactortypes";
import { SupabaseClient } from "@supabase/supabase-js";

export default function operations(client : SupabaseClient) {

    const getFilmActor = async (filmId: number, actorId: number) : Promise<any | null> => {
        const filmactors = client.from('filmactor').select().eq('film_fk', filmId).eq('actor_fk', actorId);
        return filmactors;
    }
    
    const createFilmActor = async (actor_fk: number, film_fk: number) => {

        const { error } = await client
        .from('filmactor')
        .insert({ actor_fk: actor_fk, film_fk: film_fk })        
        return { error }
    }

    const updateFilmActor = async (filmActorId : number, obj: CreateUpdateFilmActor, hm : Map<string, Object>) => {

        let updatedData : any = {};
        for (const [key, value] of hm) {
            updatedData[key] = value;
        }

        const { error } = await client
        .from('filmactor')
        .update({updatedData})
        .eq('id', filmActorId)

        return { error };
    }

    const deleteFilmActor = async (filmActorId : number) => {
        const response = await client
        .from('review')
        .delete()
        .eq('id', filmActorId)

        return { response }
    }

    return { getFilmActor, createFilmActor, updateFilmActor, deleteFilmActor }
}