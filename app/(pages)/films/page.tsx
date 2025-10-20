'use client'
import { Box, Button, Typography } from "@mui/joy";
import userOperation from "../../Backend/users/operations";
import filmOperation from "../../Backend/films/operations";
import { useEffect, useState } from "react";
import { client } from "../../Backend/createclient";
import Header from "../../Components/Header";
import { Film, Users } from '../../Types/entitytypes'
import { SupabaseClient, User } from '@supabase/supabase-js';
import CircularProgress from '@mui/material/CircularProgress';
import FilmDisplayCard from "@/app/Components/Film/FilmDisplayCard";


export default function Films () {
    const [currentUser, setCurrentUser] = useState<Users | null>(null);
    const [films, setFilms] = useState<Array<Film>>([]);
    const [loading, setLoading] = useState(true);

    async function getUser(client : SupabaseClient) {
        let { getCurrentUser } = userOperation(client);
        let { user, nonAuthUser } = await getCurrentUser();
        let authUser : User | null = user;
        let nonAUser : Users = nonAuthUser === null ? null : nonAuthUser[0];
        setCurrentUser(nonAUser);
        console.log(nonAUser);
        console.log(authUser);
    }

    async function getFilms(client : SupabaseClient) {
        let { getFilms } = filmOperation(client);
        let filmData : Array<Film> = await getFilms().then((data) => {return data.data});
        setFilms(filmData);
    }

    useEffect(() => {
        const mainFunction = async () => {
            await getUser(client);
            await getFilms(client);
            setLoading(false);
        };

        mainFunction();
    }, [])

    return (
        <>  
            <Box className='flex flex-col'>

                <Header currentUser={ currentUser } />
                
                <Box className='ml-auto mr-auto mt-42'>
                    { 
                    loading ? (
                        <Box className='flex flex-col items-center justify-center md:ml-[5vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                            <Typography sx = {{ 'color' : 'white' }}> Loading Data </Typography>
                            <CircularProgress className='mt-4' color='secondary' />
                        </Box>
                    ) :
                    (films?.length === 0 && currentUser === null && loading === false) ? (
                        <Box className='flex flex-col items-center justify-center md:ml-[5vw] md:w-[30vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                        <Typography sx = {{ 'color' : 'white' }}> There are no films stored in the site as of the moment </Typography>
                    </Box>
                    ) :
                    (films.length === 0 && currentUser?.is_admin === true && loading === false) ? (
                    <Box className='flex flex-col items-center justify-center md:ml-[5vw] md:w-[30vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                        <Typography sx = {{ 'color' : 'white' }}> There are no films stored in the site. Add a Film through the button below </Typography>
                        <Box className='mt-[3vh]'>
                            <Button color='neutral' variant='soft'> Add Film </Button>
                        </Box>
                    </Box>
                    ) : 
                    (films.length === 0 && currentUser?.is_admin === false && loading === false) ? (
                    <Box className='flex flex-col items-center justify-center md:ml-[5vw] md:w-[30vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                        <Typography sx = {{ 'color' : 'white' }}> There are no films stored in the site as of the moment </Typography>
                    </Box>
                    )
                    : (
                        <>
                        <Box className='mb-[4vh]  backdrop-blur-sm'>
                            <Typography variant='plain' sx={{ color: 'whitesmoke' }} level='h1'> Directors </Typography>
                        </Box>
                        <Box className='flex flex-row gap-10 overflow-x-auto max-w-[70vw] max-h-[90vh] h-[50vh] justify-center items-center mx-auto md:w-[50vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                        {films.map((film, idx) => (
                            <Box className='flex flex-col items-center justify-center'>
                                <Box>
                                    <FilmDisplayCard name={film.name} average_user_rating={film.average_user_rating} content_rating={film.content_rating} date_released={film.date_released} duration={film.duration}  />
                                </Box>
                            </Box>
                        ))}
                        </Box>
                    </>
                    )
                    }
                </Box>
            </Box>
        </>
    )
    
}