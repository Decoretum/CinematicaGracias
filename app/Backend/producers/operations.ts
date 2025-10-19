import { ParseDataResult, Producer } from "@/app/Types/entitytypes";
import { ProducerCreate } from "@/app/Types/producers/producertypes";
import { SupabaseClient } from "@supabase/supabase-js";

export default function operations(client : SupabaseClient) {

    const parseData = (obj: ProducerCreate) : ParseDataResult => {

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
        // Age of user must be >= 20
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

        hashmap['result'] = 'success';
        return hashmap;
    
        
    }

    const getProducers = async () : Promise<any | null> => {
        const producers = client.from('producer').select();
        return producers;
    }

    const getProducer = async (id : number) : Promise<Producer | null> => {
        const producer = await client.from('producer').select().eq('id', id);
        return producer.data![0];
    }

    
    const createProducer = async (obj: ProducerCreate) : Promise<ParseDataResult> => {

        let result = parseData(obj);
        if (result['result'] !== 'success') return result;

        const { error } = await client
        .from('producer')
        .insert({ 
            description: obj.description, birthday: obj.birthday, 
            first_name: obj.first_name, last_name: obj.last_name, sex: obj.sex
        });
        
        let response : ParseDataResult = {result: '', metadata: {}};
        response['result'] = 'success';
        response['metadata'] = { error }
        return response
    }

    const updateProducer = async (producerId : number, obj: ProducerCreate, hm : Map<string, Object>) : Promise<ParseDataResult> => {
        let result = parseData(obj);
        if (result['result'] !== 'success') return result;

        let updatedData : any = {};
        for (const [key, value] of hm) {
            updatedData[key] = value;
        }

        const { error } = await client
        .from('producer')
        .update(updatedData)
        .eq('id', producerId)

        let response : ParseDataResult = {result: '', metadata: {}};
        response['result'] = 'success';
        response['metadata'] = { error }
        return response
    }

    const deleteProducer = async (producerId : number) => {
        const response = await client
        .from('producer')
        .delete()
        .eq('id', producerId)

        return { response }
    }

    return { getProducers, getProducer, createProducer, updateProducer, deleteProducer }
}