import { ParseDataResult, Review } from "@/app/Types/entitytypes";
import { CreateUpdateReview } from "@/app/Types/reviews/reviewtypes";
import { SupabaseClient } from "@supabase/supabase-js";

export default function operations(client : SupabaseClient) {

    const parseData = (obj: CreateUpdateReview) : ParseDataResult => {
        let response = {result: '', metadata: {}};
        if(obj.content.length < 200) {
            response['result'] = 'The review should contain at least 200 characters';
            return response;
        } 
        else if (obj.rating === 0) {
            response['result'] = 'Rate the Film within the Review window';
            return response;
        }
        
        response['result'] = 'success';
        return response;
    }

    const getReviews = async () : Promise<Array<Review>> => {
        const { data }= await client.from('review').select();
        return data ?? [];
    }
    
    const createReview = async (obj: CreateUpdateReview) => {

        let parsed = parseData(obj);
        if (parsed.result !== 'success') return parsed;
        let dateToday = new Date().toLocaleDateString('en-CA');

        const { data } = await client
        .from('review')
        .insert({ date_created: dateToday, content: obj.content, film_fk: obj.film_fk, rating: obj.rating, users_fk: obj.users_fk })
        .select()
        .single();
        

        let response : ParseDataResult = {result: '', metadata: {}};
        response['result'] = 'success';
        response['metadata'] = { data }
        return response
    }

    const updateReview = async (reviewId : number, obj: CreateUpdateReview, hm : Map<string, Object>) => {

        let updatedData : any = {};
        for (const [key, value] of hm) {
            updatedData[key] = value;
        }

        const { error } = await client
        .from('review')
        .update({updatedData})
        .eq('id', reviewId)

        return { error };
    }

    const deleteReview = async (reviewId : number) => {
        const response = await client
        .from('review')
        .delete()
        .eq('id', reviewId)

        return { response }
    }

    return { getReviews, createReview, updateReview, deleteReview }
}