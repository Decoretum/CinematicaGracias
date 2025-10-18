import { SupabaseClient } from '@supabase/supabase-js';
import { Users } from '../../Types/entitytypes'

export default async function operations (client : SupabaseClient)
{
    const getCurrentUser = async () => {
        const { data: { user } } = await client.auth.getUser();
        let nonAuthUser = null;

        if (user !== null) {
            const { data } = await client.from('users').select().eq('id', user?.id);
            nonAuthUser = data;
        }
        return { user, nonAuthUser };
    }
    
    return { getCurrentUser }
}