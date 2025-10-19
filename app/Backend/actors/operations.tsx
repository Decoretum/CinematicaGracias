import ValidLink from "@/app/Helpers/ValidLink";
import { CreateActor, SocialMediaArray } from "@/app/Types/actors/actortypes";
import { Actor, ParseDataResult } from "@/app/Types/entitytypes";
import { SupabaseClient } from "@supabase/supabase-js";

export default function operations(client : SupabaseClient) {

    const parseData = (obj: CreateActor) : ParseDataResult => {

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
        
        if (age < 7) {
            hashmap['result'] = 'User must be at least 7 years of age';
            return hashmap;
        }


        // Social Media array
        if (obj.socmed !== null) {
            // let mediaArray : SocialMediaArray = obj.socmed as unknown as SocialMediaArray;
            for (let i = 0; i <= obj.socmed.length - 1; i++) {
                let arr = obj.socmed[i].split('||');
                let media = arr[0];
                let link = arr[1];
                if (media.length <= 2) {
                    hashmap['result'] = `The media name "${media}" is too short. Media name must be at least 3 characters`;
                    return hashmap;
                }

                let isValid = ValidLink(link);
                if (!isValid) {
                    hashmap['result'] = `The link for media "${media}" is invalid`;
                    return hashmap;
                }
            }    
        }

        hashmap['result'] = 'success';
        return hashmap;
    
        
    }

    const getActors = async () : Promise<any | null> => {
        const actors = client.from('actor').select();
        return actors;
    }

    const getActor = async (id : number) : Promise<Actor | null> => {
        const actor = await client.from('actor').select().eq('id', id);
        return actor.data![0];
    }

    
    const createActor = async (obj: CreateActor) : Promise<ParseDataResult> => {

        let result = parseData(obj);
        if (result['result'] !== 'success') return result;



        const { error } = await client
        .from('actor')
        .insert(obj);
        
        let response : ParseDataResult = {result: '', metadata: {}};
        response['result'] = 'success';
        response['metadata'] = { error }
        return response
    }

    const updateActor = async (actorId : number, obj: CreateActor, hm : Map<string, Object>) => {
        let result = parseData(obj);
        if (result['result'] !== 'success') return result;

        let updatedData : any = {};
        for (const [key, value] of hm) {
            updatedData[key] = value;
        }

        const { error } = await client
        .from('actor')
        .update(updatedData)
        .eq('id', actorId)

        let response : ParseDataResult = {result: '', metadata: {}};
        response['result'] = 'success';
        response['metadata'] = { error }
        return response
    }

    const deleteActor = async (actorId : number) => {
        const response = await client
        .from('actor')
        .delete()
        .eq('id', actorId)

        return { response }
    }

    return { getActors, getActor, createActor, updateActor, deleteActor }
}