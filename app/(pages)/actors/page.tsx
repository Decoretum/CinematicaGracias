'use client'
import { Box, Button, Typography } from "@mui/joy";
import userOperation from "../../Backend/users/operations";
import actorOperation from "../../Backend/actors/operations";
import { useEffect, useState } from "react";
import { client }from "../../Backend/createclient";
import Header from '../../Components/Header'
import { SupabaseClient, User } from "@supabase/supabase-js";
import { Actor, Users } from "../../Types/entitytypes";
import DisplayCard from "@/app/Components/DisplayCard";
import DeleteIcon from '@mui/icons-material/Delete';


export default function Actors () {
    const [currentUser, setCurrentUser] = useState<Users | null>(null);
    const [actors, setActors] = useState<Actor[]>([]);
    let { getActors, deleteActor } = actorOperation(client);

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
        console.log('end of function')
    }, [])

    return (
        <>  
            <Box className='flex flex-col'>
           
            <Header currentUser={currentUser} />
        
                <Box className='ml-auto mr-auto mt-42'>
                    {
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
                        <Box className='flex flex-row gap-10 max-w-[100vw]  justify-center items-center mx-auto md:w-[50vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                        {actors.map((actor, idx) => (
                            <Box className='flex flex-col items-center justify-center max-w-[20vw] max-h-[20vh]'>
                                <Box>
                                    <DisplayCard first_name={actor.first_name} last_name={actor.last_name} birthday={actor.birthday} />
                                </Box>
                                <Box className='mt-[1vh]'>
                                    <Button variant='soft' onClick={() => handleDelete(actor.id)} >
                                        <DeleteIcon />
                                    </Button>
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