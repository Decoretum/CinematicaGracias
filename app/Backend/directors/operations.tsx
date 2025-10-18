export default function operations(client : Object) {

    const getDirectors = async () : Promise<any | null> => {
        const directors = client.from('director').select();
        return directors;
    }
    
    return { getDirectors }
}