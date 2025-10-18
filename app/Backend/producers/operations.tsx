export default function operations(client : Object) {

    const getProducers = async () : Promise<any | null> => {
        const producers = client.from('producer').select();
        return producers;
    }
    
    return { getProducers }
}