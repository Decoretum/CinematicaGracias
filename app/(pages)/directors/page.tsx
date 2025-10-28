'use client'
import { Box, Button, Typography } from "@mui/joy";
import userOperation from "../../Backend/users/operations";
import directorOperation from "../../Backend/directors/operations";
import { useEffect, useState } from "react";
import { client }from "../../Backend/createclient";
import Header from '../../Components/Header'
import { SupabaseClient, User } from "@supabase/supabase-js";
import { Director, Users } from "../../Types/entitytypes";
import DisplayCard from "@/app/Components/HumanDisplayCard/DisplayCard";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";


export default function Directors () {
    const [currentUser, setCurrentUser] = useState<Users | null>(null);
    const [directors, setDirectors] = useState<Director[] | null>(null);
    let { getDirectors, deleteDirector } = directorOperation(client);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [deletingId, setDeletingId] = useState(0);
    const router = useRouter();

    async function getUser(client : SupabaseClient) {
        let { getCurrentUser } = await userOperation(client);
        let { nonAuthUser } = await getCurrentUser();
        let nonAUser : Users | null = nonAuthUser === null ? null : nonAuthUser[0];
        setCurrentUser(nonAUser);
    }

    async function handleGet(client : SupabaseClient) {
        
        let filmData = await getDirectors();
        setDirectors(filmData.data);
    }

    async function handleDelete(id: number) {
        let res = await deleteDirector(id);
        if (res.result === 'success') {
            let newArr = [];
            for (let i = 0; i <= directors!.length - 1; i ++) {
                if (directors![i].id !== id) {
                    newArr.push(directors![i]);
                    setDeleting(false);
                    setDeletingId(0);        
                }
            }
            setDirectors(newArr);
        }
    }

    useEffect(() => {
        const mainFunction = async () => {
            getUser(client);
            handleGet(client);
        };

        mainFunction();
        setLoading(false);
    }, [])

    return (
        <>  
            <Box className='flex flex-col'>
           
            <Header currentUser={currentUser} />
        
                <Box className='ml-auto mr-auto mt-42'>
                    {
                    !directors || loading ? (
                        <Box className='flex flex-col items-center justify-center md:ml-[5vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                            <Typography sx = {{ 'color' : 'white' }}> Loading Data </Typography>
                            <CircularProgress className='mt-4' color='secondary' />
                        </Box>
                    ) :        
                    (directors.length === 0 && currentUser?.is_admin === true) ? (
                    <Box className='flex flex-col items-center justify-center md:ml-[5vw] md:w-[30vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                        <Typography sx = {{'color' : 'white'}}> There are no directors stored in the site. Add a director through the button below </Typography>
                        <Box className='mt-[3vh]'>
                            <Button color='neutral' variant='soft'> Add Director </Button>
                        </Box>
                    </Box>
                    ) : 
                    (directors.length === 0 && currentUser?.is_admin === false) ? (
                    <Box className='flex flex-col items-center justify-center md:ml-[5vw] md:w-[30vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                        <Typography sx = {{'color' : 'white'}}> There are no directors stored in the site as of the moment </Typography>
                    </Box>
                    )
                    : (
                    <>
                        <Box className='mb-[4vh] flex flex-row gap-5 backdrop-blur-sm'>
                            <Typography variant='plain' sx={{ color: 'whitesmoke' }} level='h1'> Directors </Typography>
                            { currentUser?.is_admin && <Button variant='soft' onClick={() => router.push('directors/create')}><AddIcon /></Button> }
                        </Box>
                        <Box className='flex flex-row gap-10 pl-86 overflow-x-auto max-w-[80vw] max-h-[50vh] justify-center items-center mx-auto bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                        {directors.map((director, idx) => (
                            <Box className='flex flex-col gap-2 items-center justify-center'>
                                <Box className='w-[13vw] max-w-[13vw] overflow-y-auto rounded-lg'>
                                    <DisplayCard first_name={director.first_name} last_name={director.last_name} birthday={director.birthday} />
                                </Box>

                                <Box className='flex flex-row gap-2'>
                                    <Box>
                                        <Button variant='soft' onClick={() => router.push(`/directors/view/${director.id}/`)} >
                                            <InfoIcon />
                                        </Button>
                                    </Box>

                                    {currentUser?.is_admin === true && (
                                    <>
                                        <Box>
                                            <Button variant='soft' onClick={() => handleDelete(director.id)} >
                                                { deleting === true && deletingId === director.id ? <CircularProgress size='30px' />  : <DeleteIcon />}
                                            </Button>
                                        </Box>

                                        <Box>
                                        <Button variant='soft' onClick={() => router.push(`/directors/update/${director.id}/`)} size='sm' color='success'>
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