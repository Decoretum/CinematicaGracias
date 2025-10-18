import { CreateUpdateFilmProducer } from "@/app/Types/filmproducers/filmproducertypes";
import { SupabaseClient } from "@supabase/supabase-js";

export default function operations(client : SupabaseClient) {

    const getFilmProducers = async () : Promise<any | null> => {
        const filmProducers = client.from('filmproducer').select();
        return filmProducers;
    }
    
    const createFilmProducer = async (obj: CreateUpdateFilmProducer) => {

        const { error } = await client
        .from('filmproducer')
        .insert({ producer_fk: obj.producer_fk, film_fk: obj.film_fk, producer_role: obj.producer_role })        
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

    return { getFilmProducers, createFilmProducer, updateFilmProducer, deleteFilmProducer }
}