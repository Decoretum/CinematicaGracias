import { CreateUpdateFilmProducer } from "@/app/Types/filmproducers/filmproducertypes";
import { SupabaseClient } from "@supabase/supabase-js";

export default function operations(client : SupabaseClient) {

    const getFilmProducer = async (filmId: number, producerId: number) : Promise<any | null> => {
        const filmProducer = client.from('filmproducer').select().eq('film_fk', filmId).eq('producer_fk', producerId);
        return filmProducer;
    }
    
    const createFilmProducer = async (producer_fk: number, film_fk: number) => {

        const { error } = await client
        .from('filmproducer')
        .insert({ producer_fk: producer_fk, film_fk: film_fk })        
        return { error }
    }

    const updateFilmProducer = async (filmProducerId : number, obj: CreateUpdateFilmProducer, hm : Map<string, Object>) => {

        let updatedData : any = {};
        for (const [key, value] of hm) {
            updatedData[key] = value;
        }

        const { error } = await client
        .from('filmproducer')
        .update({updatedData})
        .eq('id', filmProducerId)

        return { error };
    }

    const deleteFilmProducer = async (filmProducerId : number) => {
        const response = await client
        .from('filmproducer')
        .delete()
        .eq('id', filmProducerId)

        return { response }
    }

    return { getFilmProducer, createFilmProducer, updateFilmProducer, deleteFilmProducer }
}