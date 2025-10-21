'use client'
import { Box, Button, Typography } from "@mui/joy";
import userOperation from "../../Backend/users/operations";
import actorOperation from "../../Backend/actors/operations";
import { useEffect, useState } from "react";
import { client }from "../../Backend/createclient";
import Header from '../../Components/Header'
import { SupabaseClient, User } from "@supabase/supabase-js";
import { Actor, Users } from "../../Types/entitytypes";
import DisplayCard from "@/app/Components/HumanDisplayCard/DisplayCard";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";



export default function Actors () {
    const [currentUser, setCurrentUser] = useState<Users | null>(null);
    const [actors, setActors] = useState<Actor[]>([]);
    let { getActors, deleteActor } = actorOperation(client);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    async function getUser(client : SupabaseClient) {
        let { getCurrentUser } = await userOperation(client);
        let { user, nonAuthUser } = await getCurrentUser();
        let authUser : User | null = user;
        let nonAUser : Users | null = nonAuthUser === null ? null : nonAuthUser[0];
        setCurrentUser(nonAUser);
        console.log(nonAUser);
        console.log(authUser);
    }

    async function handleGet(client : SupabaseClient) {
        
        let actorData = await getActors();
        setActors(actorData.data);
        console.log(actorData);
    }

    async function handleDelete(id: number) {
        let res = await deleteActor(id);
        console.log(res);
        if (res.result === 'success') {
            let newArr = [];
            for (let i = 0; i <= actors.length - 1; i ++) {
                if (actors[i].id !== id) {
                    newArr.push(actors[i]);
                }
            }
            setActors(newArr);
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
                    loading ? (
                        <Box className='flex flex-col items-center justify-center md:ml-[5vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                            <Typography sx = {{ 'color' : 'white' }}> Loading Data </Typography>
                            <CircularProgress className='mt-4' color='secondary' />
                        </Box>
                    ) :        
                    (actors.length === 0 && currentUser === null) ? (
                        <Box className='flex flex-col items-center justify-center md:ml-[5vw] md:w-[30vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                        <Typography sx = {{'color' : 'white'}}> There are no actors stored in the site as of the moment </Typography>
                    </Box>
                    ) :
                    (actors.length === 0 && currentUser?.is_admin === true) ? (
                    <Box className='flex flex-col items-center justify-center md:ml-[5vw] md:w-[30vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                        <Typography sx = {{'color' : 'white'}}> There are no actors stored in the site. Add an actor through the button below </Typography>
                        <Box className='mt-[3vh]'>
                            <Button color='neutral' variant='soft'> Add Actor </Button>
                        </Box>
                    </Box>
                    ) : 
                    (actors.length === 0 && currentUser?.is_admin === false) ? (
                    <Box className='flex flex-col items-center justify-center md:ml-[5vw] md:w-[30vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                        <Typography sx = {{'color' : 'white'}}> There are no actors stored in the site as of the moment </Typography>
                    </Box>
                    )
                    : (
                    <>
                        <Box className='mb-[4vh]  backdrop-blur-sm'>
                            <Typography variant='plain' sx={{ color: 'whitesmoke' }} level='h1'> Actors </Typography>
                        </Box>
                        <Box className='flex flex-row gap-10 max-w-[70vw] overflow-x-auto pl-100 max-h-[50vh] justify-center items-center mx-auto md:w-[50vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                        {actors.map((actor, idx) => (
                            <Box className='flex flex-col gap-2 items-center justify-center'>
                                <Box className='w-[13vw] max-w-[13vw] max-h-[50vh] max-h-[20vh] overflow-y-auto rounded-lg'>
                                    <DisplayCard first_name={actor.first_name} last_name={actor.last_name} birthday={actor.birthday} />
                                </Box>
                                <Box className='flex flex-row gap-5'>
                                    <Box>
                                        <Button variant='soft' onClick={() => handleDelete(actor.id)} >
                                            <DeleteIcon />
                                        </Button>
                                    </Box>
                                    <Box>
                                    <Button variant='soft' onClick={() => router.push(`actors/update/${actor.id}/`)} size='sm' color='success'>
                                        <EditIcon fontSize="small" />
                                    </Button>
                                    </Box>
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