import { ParseDataResult } from "@/app/Types/entitytypes";
import { CreateUpdateFilm } from "@/app/Types/films/filmtypes";
import { CreateUpdateProducer } from "@/app/Types/producers/producertypes";
import { SupabaseClient } from "@supabase/supabase-js";

export default function operations(client : SupabaseClient) {

    const parseData = (obj: CreateUpdateFilm) : ParseDataResult => {

        // Data Validation

        let hashmap : ParseDataResult = {
            result: "",
            metadata: {}
        };

        const isSpecial = (password : string) => {
            let specialCount = 0;
            for (let i = 0; i <= password.length - 1; i++) {
                let char : string = password.at(i)!;
                let satisfies = 
                /[A-Z]/.test(char) === false &&
                /[a-z]/.test(char) === false &&
                /\d/.test(char) === false;
                if (satisfies === true) specialCount += 1; 
            }
            if (specialCount >= 1) return true;
            return false; 
        }
    
        const nameValidator = (name : string, int : number) => {
            let formattedName = name.replace(/\s+/g, '');
            return name.replace(/\s+/g, '').length >= int && /\d/.test(formattedName) === false && isSpecial(formattedName) === false;
        }
    
        hashmap['result'] = 'success';
        hashmap['metadata'] = {};
        return hashmap;
    }

    const getFilms = async () : Promise<any | null> => {
        const films = client.from('film').select();
        return films;
    }
    
    const createProducer = async (obj: CreateUpdateFilm) => {

        let result = parseData(obj);
        if (result['result'] !== 'success') return result;

        const { error } = await client
        .from('producer')
        .insert({obj});
        
        return { error }
    }

    const updateProducer = async (producerId : number, obj: CreateUpdateFilm, hm : Map<string, Object>) => {
        let result = parseData(obj);
        if (result['result'] !== 'success') return result;

        let updatedData : any = {};
        for (const [key, value] of hm) {
            updatedData[key] = value;
        }

        const { error } = await client
        .from('director')
        .update({updatedData})
        .eq('id', producerId)

        return { error };
    }

    const deleteProducer = async (producerId : number) => {
        const response = await client
        .from('producer')
        .delete()
        .eq('id', producerId)

        return { response }
    }

    return { getFilms, createProducer, updateProducer, deleteProducer }
}