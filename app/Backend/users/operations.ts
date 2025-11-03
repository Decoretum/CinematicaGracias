import { GoTrueAdminApi, SupabaseClient, User } from '@supabase/supabase-js';
import { ParseDataResult, Users } from '../../Types/entitytypes'
import { EditUser, SignUpUser } from '@/app/Types/users/usertypes';

export default async function operations (client : SupabaseClient)
{
    const parseUserData = async (obj?: SignUpUser, editObj?: EditUser) : Promise<ParseDataResult> => {

        // Data Validation

        let hashmap : any = {'result' : '', metadata : ''};

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

        let entity : SignUpUser | EditUser | undefined = obj !== undefined ? obj : editObj;

        // Username - length must be at least >= 4
        
        let usernameLength = entity!.username.trim().length >= 4 || entity!.username.replace(/\s+/g, '').length > 4;
        let duplicate = await getUser(entity!.username.trim().toLowerCase());
        let usernameResponse = 'This username already exists';
        if (!usernameLength) {
            hashmap['result'] = 'Username\'s length must contain at least 4 characters';
            return hashmap;
        } 
        
        else if (duplicate !== null) {
            if (editObj === undefined) {
                hashmap['result'] = usernameResponse;
                return hashmap;
            } else {
                // Find users with different ids but same username
                let users = await getUsers(entity!.username!.trim().toLowerCase())
                let usersFiltered = users.filter((u) => u.id !== entity?.id && u.username.trim().toLowerCase() === entity?.username.trim().toLowerCase());
                if (usersFiltered.length >= 1) {
                    hashmap['result'] = usernameResponse;
                    return hashmap;
                }
            }
        }
    
        // Password
        // length >= 8, 
        // one uppercase and one lowercase letter
        // at least one number
        // at least one special character, Reference: https://www.ascii-code.com/
        // If samePassword property is true, then no need to go through validation
        
        let editValidationPassword = (entity && 'samePassword' in entity) && (entity.samePassword === false);

        if (editValidationPassword === true || (entity && 'samePassword' in entity === false)) {
            let length = entity!.password.replace(/\s+/g, '').length >= 8;
            if (!length) {
                hashmap['result'] = 'The password must contain at least 8 characters';
                return hashmap;
            } 
        
            let lower = /[a-z]/.test(entity!.password);
            if (!lower) {
                hashmap['result'] = 'The password must contain at least 1 lower-case characater';
                return hashmap;
            }
        
            let upper = /[A-Z]/.test(entity!.password);
            if (!upper) {
                hashmap['result'] = 'The password must contain at least 1 upper-case character';
                return hashmap;
            }
        
            let numeric = /\d/.test(entity!.password);
            if (!numeric) {
                hashmap['result'] = 'The password must contain at least 1 numeric character';
                return hashmap;
            }
        
            if (!isSpecial(entity!.password)) {
                hashmap['result'] = 'Your password must contain at least 1 special character'
                return hashmap;
            }
        } 

        // First Name
        // No Numbers and Symbols
        // length >= 3
    
        let validFirstName = nameValidator(entity!.first_name, 3);
        if (!validFirstName) {
            hashmap['result'] = 'First Name must have at least 3 characters and cannot have numbers or symbols';
            return hashmap;
        }
    
        // Last Name
        // Same condition as First Name
    
        let validLastName = nameValidator(entity!.last_name, 2);
        if (!validLastName) {
            hashmap['result'] = 'Last Name must have at least 2 characters and cannot have numbers or symbols';
            return hashmap;
        }
    
        // Email
        // a character before and after @
        // a . after domain
        
        let charsBefore = entity!.email.substring(0, entity!.email.indexOf('@'));
        let charsAfter = entity!.email.substring(entity!.email.indexOf('@') + 1, entity!.email.indexOf('.'));
        let charsAfterDot = entity!.email.substring(entity!.email.indexOf('.') + 1, entity!.email.length);
        let dotChar = entity!.email.includes('.');
    
        let separatorCount = (email : string) => {
            let count = 0;
            for (let i = 0; i <= email.length - 1; i++) {
            if (email[i] === '@') count ++;
            }
            return count;
        }
        let validEmail = charsBefore.length >= 1 && separatorCount(entity!.email) === 1 && charsAfter.length >= 1 && dotChar === true && charsAfterDot.length >= 1;
        if (!validEmail) {
            hashmap['result'] = 'Invalid email'
            return hashmap;
        } 
        
        let res = await fetch('/api/users', { method: 'GET' });
        const data: { users: Array<User> } = await res.json();
        let emails = data.users.filter((u) => u.email === entity!.email.trim());
        let duplicateEmail = emails.length >= 1;
        let response = 'An existing account uses this email';

        if (duplicateEmail) {
            if (editObj === undefined) {
                hashmap['result'] = response;
                return hashmap;
            } else {
                // Count users with same email but different id
                let existing = data.users.filter((u) => u.email === entity?.email.trim() && u.id !== entity!.id);
                if (existing.length >= 1) {
                    hashmap['result'] = 'An existing account uses this email';
                    return hashmap;
                }
            }
        }
    
        // Birthday
        // Age of user must be >= 7
        // Based on Month and Day values, age value will be reduced by 1
    
        let birthday = new Date(entity!.birthday);
        let current = new Date();
        
        let age = current.getFullYear() - birthday.getFullYear();
    
        if (current.getMonth() < birthday.getMonth() 
        || (birthday.getMonth() === current.getMonth() && birthday.getDate() > current.getDate())) age--;
        
        if (age < 7) {
            hashmap['result'] = 'User must be at least 7 years of age';
            return hashmap;
        }

        hashmap['result'] = 'success';
        

        return hashmap;


    }

    const getUsername = async (id: string) : Promise<string> => {
        const { data } = await client.from('users').select('username').eq('id', id).single();
        return data!.username;
    }

    const getUser = async (username: string) : Promise<Users> => {
        const { data } = await client.from('users').select().ilike('username', username.trim().toLowerCase()).single();
        return data;
    }

    const getUsers = async (username?: string) : Promise<Array<Users>> => {
        if (username !== undefined) {
            const { data } = await client.from('users').select().ilike('username', username.trim().toLowerCase());
            return data || [];
            }
        const { data } = await client.from('users').select();
        return data || [];
    }

    const getCurrentUser = async () => {
        const { data: { user } } = await client.auth.getUser();
        let nonAuthUser = null;

        if (user !== null) {
            const { data } = await client.from('users').select().eq('id', user?.id);
            nonAuthUser = data;
        }
        return { user, nonAuthUser };
    }

    const updateUser = async (userId : string, obj:EditUser, hm : Map<string, Object>) => {
        
        // Iterate Over hashmap
        // Key = field to be updated, Value = new value for the field

        let hashmap : ParseDataResult = await parseUserData(undefined, obj);
        if (hashmap['result'] !== 'success') return hashmap;

        if (hm.size === 0) {
            hashmap['metadata'] = null;
            return hashmap;
        } 
        console.log(hm)
        // User Table Data Validation

        const email : string = hm.get('email') as string;
        const password : string = hm.get('password') as string;

        if (hm.has('email') && obj.samePassword === false) {
            let response = await fetch('/api/users/update', { 
                method: 'PUT',
                body: JSON.stringify({
                    userId: obj.id,
                    email: obj.email,
                    password: obj.password
                })
            });

            let result = await response.json();
            if (result['error'] !== null) hashmap['result'] = result['error']['message'];
            else {
                hashmap['result'] = 'success';
                hashmap['metadata'] = 'change password';
            }
            return hashmap;
        } 
        else if (hm.has('email') && obj.samePassword === true) {
            let response = await fetch('/api/users/update', { 
                method: 'PUT',
                body: JSON.stringify({
                    userId: obj.id,
                    email: obj.email,
                    password: null
                })
            });

            let result = await response.json();
            if (result['error'] !== null) hashmap['result'] = result['error']['message'];
            else hashmap['result'] = 'success';
                
            return hashmap;
        } else if (!hm.has('email') && obj.samePassword === false) {
            let response = await fetch('/api/users/update', { 
                method: 'PUT',
                body: JSON.stringify({
                    userId: obj.id,
                    email: null,
                    password: obj.password
                })
            });

            let result = await response.json();
            if (result['error'] !== null) hashmap['result'] = result['error']['message'];
            else {
                hashmap['result'] = 'success';
                hashmap['metadata'] = 'change password';
            }

            return hashmap;
        } 

        console.log('nonauth')
        // Update the non-auth Users Model

        hm.delete('email');
        hm.delete('password');
        let updatedData : any = {};
        for (const [key, value] of hm) {
            updatedData[key] = value;
        }

        const { error } = await client
        .from('users')
        .update(updatedData)
        .eq('id', userId);
        
        hashmap['result'] = 'success';
        hashmap['metadata'] = { error };
        return hashmap; 
    }

    return { getCurrentUser, getUser, getUsers, updateUser, parseUserData, getUsername }
}