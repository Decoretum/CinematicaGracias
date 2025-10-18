import { ParseDataResult } from "@/app/Types/entitytypes";
import { CreateUpdateReview } from "@/app/Types/reviews/reviewtypes";
import { SupabaseClient } from "@supabase/supabase-js";

export default function operations(client : SupabaseClient) {

    const getReviews = async () : Promise<any | null> => {
        const reviews = client.from('review').select();
        return reviews;
    }
    
    const createReview = async (obj: CreateUpdateReview) => {

        const { error } = await client
        .from('review')
        .insert({ content: obj.content, film_fk: obj.film_fk, rating: obj.rating, users_fk: obj.users_fk });
        
        return { error }
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