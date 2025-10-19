import { DirectorCreateUpdate } from "@/app/Types/directors/directortypes";
import { Director, EntityResponse, ParseDataResult } from "@/app/Types/entitytypes";
import { SupabaseClient } from "@supabase/supabase-js";

export default function operations(client : SupabaseClient) {

    const parseData = (obj: DirectorCreateUpdate) : ParseDataResult => {

        // Data Validation

        let hashmap : any = {};

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
    
    
        // Birthday
        // Age of user must be >= 7
        // Based on Month and Day values, age value will be reduced by 1
    
        let birthday = new Date(obj.birthday);
        let current = new Date();
        
        let age = current.getFullYear() - birthday.getFullYear();
    
        if (current.getMonth() < birthday.getMonth() 
        || (birthday.getMonth() === current.getMonth() && birthday.getDate() > current.getDate())) age--;
        
        if (age < 20) {
            hashmap['result'] = 'User must be at least 20 years of age';
            return hashmap;
        }

        // Description
        // Must have at least 100 characters
        if (obj.description.length < 100) {
            hashmap['result'] = 'Description must have at least 100 characters';
            return hashmap;
        }

        hashmap['result'] = 'success';
        return hashmap;
    }

    const getDirectors = async () : Promise<any | null> => {
        const directors = client.from('director').select();
        return directors;
    }

    const getDirector = async (id : number) : Promise<Director | null> => {
        const director = await client.from('director').select().eq('id', id);
        return director.data![0];
    }
    
    const createDirector = async (obj: DirectorCreateUpdate) : Promise<ParseDataResult> => {

        let result = parseData(obj);
        if (result['result'] !== 'success') return result;

        const { error } = await client
        .from('director')
        .insert({ 
            birthday: obj.birthday, description: obj.description,
            first_name: obj.first_name, last_name: obj.last_name, sex: obj.sex  
        });
        
        let response : ParseDataResult = {result: '', metadata: {}};
        response['result'] = 'success';
        response['metadata'] = { error }
        return response
    }

    const updateDirector = async (directorId : number, obj: DirectorCreateUpdate, hm : Map<string, Array<object>>) : Promise<ParseDataResult> => {
        let result = parseData(obj);
        if (result['result'] !== 'success') return result;

        let updatedData : any = {};
        for (const [key, value] of hm) {
            updatedData[key] = value;
        }

        const { error } = await client
        .from('director')
        .update(updatedData)
        .eq('id', directorId)

        let response : ParseDataResult = {result: '', metadata: {}};
        response['result'] = 'success';
        response['metadata'] = { error }
        return response
    }

    const deleteDirector = async (directorId : number): Promise<ParseDataResult> => {
        const deletion = await client
        .from('director')
        .delete()
        .eq('id', directorId)

        let response : ParseDataResult = {result: '', metadata: {}};
        response['result'] = 'success';
        response['metadata'] = { deletion }
        return response

    }

    return { getDirectors, getDirector, createDirector, updateDirector, deleteDirector }
}