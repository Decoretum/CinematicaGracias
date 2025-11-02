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
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import { useRouter } from "next/navigation";



export default function Films () {
    const [currentUser, setCurrentUser] = useState<Users | null>(null);
    const [films, setFilms] = useState<Array<Film> | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [deletingId, setDeletingId] = useState(0);
    const router = useRouter();

    async function getUser(client : SupabaseClient) {
        let { getCurrentUser } = userOperation(client);
        let { user, nonAuthUser } = await getCurrentUser();
        let authUser : User | null = user;
        let nonAUser : Users = nonAuthUser === null ? null : nonAuthUser[0];
        setCurrentUser(nonAUser);
    }

    async function getFilms(client : SupabaseClient) {
        let { getFilms } = filmOperation(client);
        let filmData : Array<Film> = await getFilms();
        setFilms(filmData);
    }

    async function handleDelete(id: number) {
        let { deleteFilm } = filmOperation(client);
        setDeleting(true);
        setDeletingId(id);
        let response = await deleteFilm(id);
        if (response.response.status === 204) {
            let newArr = films!.filter((f) => f.id !== id);
            setFilms(newArr);
            setDeleting(false);
            setDeletingId(0);
        }
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
                    !films ? (
                        <Box className='flex flex-col items-center justify-center md:ml-[5vw] bg-black/30 p-6 rounded-lg text-white backdrop-blur-sm'>
                            <Typography sx = {{ 'color' : 'white' }}> Loading Data </Typography>
                            <CircularProgress className='mt-4' color='secondary' />
                        </Box>
                    ) :
                    (films.length === 0 && currentUser?.is_admin === true) ? (
                    <Box className='flex flex-col items-center justify-center md:ml-[5vw] md:w-[30vw] bg-black/30 p-6 rounded-lg text-white backdrop-blur-sm'>
                        <Typography sx = {{ 'color' : 'white' }}> There are no films stored in the site. Add a Film through the button below </Typography>
                        <Box className='mt-[3vh]'>
                            <Button color='neutral' variant='soft'> Add Film </Button>
                        </Box>
                    </Box>
                    ) : 
                    (films.length === 0 && currentUser?.is_admin === false) ? (
                    <Box className='flex flex-col items-center justify-center md:ml-[5vw] md:w-[30vw] bg-black/30 p-6 rounded-lg text-white backdrop-blur-sm'>
                        <Typography sx = {{ 'color' : 'white' }}> There are no films stored in the site as of the moment </Typography>
                    </Box>
                    ) :
                     (
                        <>
                        <Box className='mb-[4vh] flex flex-row gap-5 backdrop-blur-sm'>
                            <Typography variant='plain' sx={{ color: 'whitesmoke' }} level='h1'> Films </Typography>
                            { currentUser?.is_admin && <Button variant='soft' onClick={() => router.push('/films/create')}><AddIcon /></Button> }
                        </Box>
                        <Box className='flex flex-row gap-10 overflow-x-auto max-w-[70vw] max-h-[50vh] pl-100 justify-center items-center mx-auto bg-black/30 p-6 rounded-lg text-white backdrop-blur-sm'>
                        {films.map((film, idx) => (
                            <Box key={idx} className='flex flex-col gap-2 items-center justify-center'>
                                <Box>
                                    <FilmDisplayCard name={film.name} average_user_rating={film.average_user_rating} content_rating={film.content_rating} date_released={film.date_released} duration={film.duration}  />
                                </Box>
                                <Box className='flex flex-row gap-2'>
                                    <Box>
                                        <Button variant='soft' onClick={() => router.push(`/films/view/${film.id}/`)} >
                                            <InfoIcon />
                                        </Button>
                                    </Box>

                                    {currentUser?.is_admin && (
                                    <>
                                        <Box>
                                            <Button variant='soft' onClick={() => handleDelete(film.id)} >
                                                { deleting === true && deletingId === film.id ? <CircularProgress size='30px' />  : <DeleteIcon />}
                                            </Button>
                                        </Box>

                                        <Box>
                                        <Button variant='soft' onClick={() => router.push(`/films/update/${film.id}/`)} size='sm' color='success'>
                                            <EditIcon fontSize="small" />
                                        </Button>
                                        </Box>
                                    </>
                                    )}
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