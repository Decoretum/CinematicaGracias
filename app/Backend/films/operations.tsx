import { SupabaseClient } from "@supabase/supabase-js";

export default function operations(client : SupabaseClient) {
    
    const getFilms = async () : Promise<any | null> => {
        const films = client.from('film').select();
        return films;
    }
    
    return { getFilms }
}