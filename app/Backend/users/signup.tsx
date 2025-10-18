import createclient from '../createclient'
import { SignUpEditUser } from '../../Types/users/usertypes'
import operations from './operations';
import { ParseDataResult } from '@/app/Types/entitytypes';


export default async function Signup (obj : SignUpEditUser)
{
    const client = createclient();
    const { parseUserData } = await operations(client);
    let hashmap : ParseDataResult = await parseUserData(obj);
    if (hashmap['result'] !== 'success') return hashmap;

    
    // Create Auth User Entity

    const { data } = await client.auth.signUp({
        email: obj.email,
        password: obj.password,
      })
    
    if (!data.user?.id) {
      hashmap['result'] = 'Users ID failed as of the moment. Retrying'
      return hashmap;
    }

    // Create non-Auth User Entity
    // DATE = YYYY-MM-DD in string type
    
    const { error } = await client
    .from('users')
    .insert({ id: data.user.id, first_name: obj.first_name?.trim(), last_name: obj.last_name?.trim(), sex: obj.sex, birthday: obj.birthday, username: obj.username?.trim(), password: obj.password.trim(), is_admin: obj.is_admin })
    
    hashmap['result'] = 'success';
    hashmap['metadata'] = { data, error };

    return hashmap;
}


