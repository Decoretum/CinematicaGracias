'use client'
import Header from "@/app/Components/Header";
import { Actor, Director, Film, FilmActor, FilmProducer, Producer, Users } from "@/app/Types/entitytypes";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import producerOperation from "../../../../Backend/producers/operations";
import userOperation from "../../../../Backend/users/operations";
import filmOperation from "../../../../Backend/films/operations"
import actorOperation from "../../../../Backend/actors/operations"
import directorOperation from "../../../../Backend/directors/operations"
import filmProducerOperation from "../../../../Backend/filmproducers/operation"
import filmActorOperation from "../../../../Backend/filmactors/operation"

import { client } from "@/app/Backend/createclient";
import { Box } from "@mui/joy";
import { CircularProgress, Snackbar, Typography } from "@mui/material";

export default function Info ({ params } : { params : Promise<{ n : number }> }) {
    const [currentUser, setCurrentUser] = useState<Users | null>(null);
    const [film, setFilm] = useState<Film>();
    const [alert, setAlert] = useState(false);
    const [message, setMessage] = useState('');
    const [director, setDirector] = useState<Director>();
    const [producers, setProducers] = useState<Array<Producer>>();
    const [actors, setActors] = useState<Array<Actor>>();

    async function getUser(client : SupabaseClient) {
        let { getCurrentUser } = userOperation(client);
        let { nonAuthUser } = await getCurrentUser();
        let nonAUser : Users = nonAuthUser === null ? null : nonAuthUser[0];
        setCurrentUser(nonAUser);
        console.log(nonAUser);
    }

    function extractText(entity: Array<Actor> | Array<Producer>) : Array<string> {
        let arr = [];
        for (let i = 0; i <= entity.length - 1; i++) {
            let human = entity[i];
            arr.push(`${human.first_name} ${human.last_name}`);
        }
        return arr;
    }

    function formatText(text: Array<string>, isGenre?: boolean) : string {
        let formatted = '';
        let justOne = text.length === 1;
        let onlyTwo = text.length === 2;

        if (isGenre) {
            text = text.map((t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
        }

        if (onlyTwo) formatted += `${text[0]} and ${text[1]}`
        else if (justOne) formatted = text[0];
        else {
            for (let i = 0; i <= text.length - 1; i++) {
                let word = text[i];
                if (i === text.length - 1) formatted += `, and ${word}`;
                else if (i === text.length - 2) formatted += word;
                else formatted += `${word},`;
            }
        }

        return formatted;
    }

    async function getAssociated(filmId: number) : Promise<{ actors : Array<Actor>, producers : Array<Producer> }> {
        let { getFilmProducers } = filmProducerOperation(client);
        let { getFilmActors } = filmActorOperation(client);
        let { getProducer } = producerOperation(client);
        let { getActor} = actorOperation(client);
        let filmprod : Array<FilmProducer> = await getFilmProducers(filmId);
        let filmactor : Array<FilmActor> = await getFilmActors(filmId);
        let actArr  = [];
        let prodArr = [];

        // Get producers associated
        for (let i = 0; i <= filmprod.length - 1; i++) {
            let prodId = filmprod[i].producer_fk;
            let prod = await getProducer(prodId!);
            prodArr.push(prod);
        }

        // Get Actors associated
        for (let i = 0; i <= filmactor.length - 1; i++) {
            let actorId = filmactor[i].actor_fk;
            let actor : Actor = await getActor(actorId!);
            actArr.push(actor);
        }

        return { actors : actArr,  producers: prodArr }
    }

    useEffect(() => {
        const main = async () => {
            getUser(client);

            // Format Film
            let { n } = await params;
            let { getFilm } = filmOperation(client);
            let query = await getFilm(n);
            setFilm(query);

            // Get Director
            let { getDirector } = directorOperation(client);
            let director : Director = await getDirector(query.director_fk!);
            setDirector(director);
            
            // Format Producers and Actors
            let { actors, producers } = await getAssociated(query.id);

            setActors(actors);
            setProducers(producers);
            console.log(actors);
            console.log(producers);
            console.log(director);

            
        }
        main();
    }, [])


    if (!film || !producers || !actors || !director) {
        return(
            <>
                <Header currentUser={ undefined } />
                <Box className='flex h-screen items-center justify-center'>
                    <Box className='flex flex-col justify-center items-center mx-auto h-[15vh] md:w-[50vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm rounded-lg'>
                        Loading Data
                        <CircularProgress className='mt-4' color='secondary' /> 
                    </Box>
                </Box>
            </>
        )
    }



    return (
        <>
            <Header currentUser={ currentUser } />
            <Box className='flex flex-col gap-5 md:min-h-[100vh] md:max-w-[50vw] w-[50vw] mx-auto bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                <Box className='flex flex-row gap-65'>
                    <Typography variant='h3'>
                        { film.name }
                    </Typography>
                    <Typography>
                        { film.duration } minutes
                    </Typography>
                </Box>

                <Box><Typography variant='h6'>Average Rating: { film.average_user_rating } / 10 ★</Typography></Box>
                <Box className='flex flex-row gap-80'>
                    <Typography>Released on { film.date_released }</Typography>
                    <Typography>Directed by {`${director.first_name} ${director.last_name}`} </Typography>
                </Box>
                <Box className='flex flex-row gap-89 max-w-[50vw] mt-[4vh]'>
                    <Box className='max-w-[8vw]'>
                        <Typography>Maturity Rating: { film.content_rating }
                        <ReportGmailerrorredIcon className='ml-[0.5vw] mb-[1vh]' />
                        </Typography>
                    </Box>
                    <Typography>Framerate of { film.frame_rate }</Typography>
                </Box>

                <Box className='flex flex-col gap-4 mt-[4vh]'>
                    <Typography variant='h4'> Overview </Typography>
                    <Typography variant='body2'> {film.description} </Typography>
                </Box>

                <Box className='mt-[4vh]'>
                    <Typography variant='h5'>Genres</Typography>
                    <Box className='mt-[2vh]'>
                        <Typography variant='body2'>{ formatText(film.genres, true) } </Typography>
                    </Box>
                </Box>

                <Box className='flex flex-row gap-20 mt-[4vh] justify-center'>
                    <Box className='max-w-[20vw]'>
                        <Typography variant='h5'>Producers</Typography>
                        <Box className='mt-[2vh]'>
                            <Typography variant='body2'>{ formatText(extractText(producers)) } </Typography>
                        </Box>
                    </Box>
                    <Box className='max-w-[20vw]'>
                        <Typography variant='h5'>Actors</Typography>
                        <Box className='mt-[2vh]'>
                            <Typography variant='body2'>{ formatText(extractText(actors)) } </Typography>
                        </Box>
                    </Box>

                </Box>

            </Box>


            <Snackbar
            open={alert}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            autoHideDuration={6000}
            onClose={() => setAlert(false)}
            message={message}
            />
        </>
    )
}