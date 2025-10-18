export default function operations(client : Object) {

    const getActors = async () : Promise<any | null> => {
        const actors = client.from('actor').select();
        return actors;
    }
    
    return { getActors }
}