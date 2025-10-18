import { SupabaseClient } from '@supabase/supabase-js';
import { ParseDataResult } from '../../Types/entitytypes'
import { SignUpEditUser } from '@/app/Types/users/usertypes';

export default async function operations (client : SupabaseClient)
{
    const parseUserData = async (obj: SignUpEditUser) : Promise<ParseDataResult> => {

        // Data Validation

        let hashmap : any = {};

        const isSpecial = (password : string) => {
            let specialCount = 0;
            for (let i = 0; i <= password.length - 1; i++) {
            let char : string = password.at(i);
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
    
    
        // Username - length must be at least >= 4
        
        let usernameCondition = obj.username.trim().length >= 4 || obj.username.replace(/\s+/g, '').length > 4;
        if (!usernameCondition) {
            hashmap['result'] = 'Username\'s length must contain at least 4 characters';
            return hashmap;
        }
    
        // Password
        // length >= 8, 
        // one uppercase and one lowercase letter
        // at least one number
        // at least one special character, Reference: https://www.ascii-code.com/
    
        let length = obj.password.replace(/\s+/g, '').length >= 8;
        if (!length) {
            hashmap['result'] = 'The password must contain at least 8 characters';
            return hashmap;
        } 
    
        let lower = /[a-z]/.test(obj.password);
        if (!lower) {
            hashmap['result'] = 'The password must contain at least 1 lower-case characater';
            return hashmap;
        }
    
        let upper = /[A-Z]/.test(obj.password);
        if (!upper) {
            hashmap['result'] = 'The password must contain at least 1 upper-case character';
            return hashmap;
        }
    
        let numeric = /\d/.test(obj.password);
        if (!numeric) {
            hashmap['result'] = 'The password must contain at least 1 numeric character';
            return hashmap;
        }
    
        if (!isSpecial(obj.password)) {
            hashmap['result'] = 'Your password must contain at least 1 special character'
            return hashmap;
        }
    
        // First Name
        // No Numbers and Symbols
        // length >= 3
    
        let validFirstName = nameValidator(obj.first_name, 3);
        if (!validFirstName) {
            hashmap['result'] = 'First Name must have at least 3 characters and cannot have numbers or symbols';
            return hashmap;
        }
    
        // Last Name
        // Same condition as First Name
    
        let validLastName = nameValidator(obj.last_name, 2);
        if (!validLastName) {
            hashmap['result'] = 'Last Name must have at least 2 characters and cannot have numbers or symbols';
            return hashmap;
        }
    
        // Email
        // a character before and after @
        // a . after domain
        
        let charsBefore = obj.email.substring(0, obj.email.indexOf('@'));
        let charsAfter = obj.email.substring(obj.email.indexOf('@') + 1, obj.email.indexOf('.'));
        let charsAfterDot = obj.email.substring(obj.email.indexOf('.') + 1, obj.email.length);
        let dotChar = obj.email.includes('.');
    
        let separatorCount = (email : string) => {
            let count = 0;
            for (let i = 0; i <= email.length - 1; i++) {
            if (email[i] === '@') count ++;
            }
            return count;
        }
        let validEmail = charsBefore.length >= 1 && separatorCount(obj.email) === 1 && charsAfter.length >= 1 && dotChar === true && charsAfterDot.length >= 1;
        if (!validEmail) {
            hashmap['result'] = 'Invalid email'
            return hashmap;
        }    
    
        // Birthday
        // Age of user must be >= 7
        // Based on Month and Day values, age value will be reduced by 1
    
        let birthday = new Date(obj.birthday);
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

    const getCurrentUser = async () => {
        const { data: { user } } = await client.auth.getUser();
        let nonAuthUser = null;

        if (user !== null) {
            const { data } = await client.from('users').select().eq('id', user?.id);
            nonAuthUser = data;
        }
        return { user, nonAuthUser };
    }

    const updateUser = async (userId : string, obj:SignUpEditUser, hm : Map<string, Object>) => {
        
        // Iterate Over hashmap
        // Key = field to be updated, Value = new value for the field

        let hashmap : ParseDataResult = await parseUserData(obj);
        if (hashmap['result'] !== 'success') return hashmap;
        
        if (hm.has('email') && !hm.has('password')) {
            const { data, error } = await client.auth.updateUser({
                email: hm.get('email')
            })
        } else if (!hm.has('email') && hm.has('password')) {
            const { data, error } = await client.auth.updateUser({
                password: hm.get('password') 
            })
        } else if (hm.has('email') && hm.has('password')) {
            const { data, error } = await client.auth.updateUser({
                email: hm.get('email'),
                password: hm.get('password') 
            })
        }

        // Update the non-auth Users Model
        
        let updatedData : any = {};
        for (const [key, value] of hm) {
            updatedData[key] = value;
        }

        const { error } = await client
        .from('users')
        .update(updatedData)
        .eq('id', userId);
        
        return { error } 
    }

    return { getCurrentUser, updateUser, parseUserData }
}