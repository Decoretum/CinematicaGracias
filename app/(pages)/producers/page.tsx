'use client'
import { Box, Button, Typography } from "@mui/joy";
import userOperation from "../../Backend/users/operations";
import producerOperation from "../../Backend/producers/operations";
import { useEffect, useState } from "react";
import { client }from "../../Backend/createclient";
import Header from '../../Components/Header'
import { SupabaseClient, User } from "@supabase/supabase-js";
import { Producer, Users } from "../../Types/entitytypes";
import DisplayCard from "@/app/Components/HumanDisplayCard/DisplayCard";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";


export default function Producers () {
    const [currentUser, setCurrentUser] = useState<Users | null>(null);
    const [producers, setProducers] = useState<Producer[]>([]);
    const [deleting, setDeleting] = useState(false);
    const[deletingId, setDeletingId] = useState(0);
    let { getProducers, deleteProducer } = producerOperation(client);
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
        
        let prodData = await getProducers();
        setProducers(prodData.data);
        console.log(prodData);
    }

    async function handleDelete(id: number) {
        let res = await deleteProducer(id);
        setDeleting(true);
        setDeletingId(id);

        if (res.result === 'success') {
            let newArr = [];
            for (let i = 0; i <= producers.length - 1; i ++) {
                if (producers[i].id !== id) {
                    newArr.push(producers[i]);
                    setDeleting(false);
                    setDeletingId(0);
                }
            }
            setProducers(newArr);
        }
    }

    useEffect(() => {
        const mainFunction = async () => {
            getUser(client);
            handleGet(client);
        };

        mainFunction();
    }, [])

    return (
        <>  
            <Box className='flex flex-col'>
           
            <Header currentUser={currentUser} />
        
                <Box className='ml-auto mr-auto mt-42'>
                    {
                    !producers ? (
                        <Box className='flex flex-col items-center justify-center md:ml-[5vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                            <Typography sx = {{ 'color' : 'white' }}> Loading Data </Typography>
                            <CircularProgress className='mt-4' color='secondary' />
                        </Box>
                    ) :        
                    (producers.length === 0) ? (
                        <Box className='flex flex-col items-center justify-center md:ml-[5vw] md:w-[30vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                        <Typography sx = {{'color' : 'white'}}> There are no producers stored in the site as of the moment </Typography>
                    </Box>
                    ) :
                    (producers.length === 0 && currentUser?.is_admin === true) ? (
                    <Box className='flex flex-col items-center justify-center md:ml-[5vw] md:w-[30vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                        <Typography sx = {{'color' : 'white'}}> There are no producers stored in the site. Add a producer through the button below </Typography>
                        <Box className='mt-[3vh]'>
                            <Button color='neutral' variant='soft'> Add Producer </Button>
                        </Box>
                    </Box>
                    ) : 
                    (producers.length === 0 && currentUser?.is_admin === false) ? (
                    <Box className='flex flex-col items-center justify-center md:ml-[5vw] md:w-[30vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                        <Typography sx = {{'color' : 'white'}}> There are no producers stored in the site as of the moment </Typography>
                    </Box>
                    )
                    : (
                    <>
                        <Box className='mb-[4vh] w-[30vw]  backdrop-blur-sm'>
                            <Typography variant='plain' sx={{ color: 'whitesmoke' }} level='h1'> Producers </Typography>
                        </Box>
                        <Box className='max-w-[60vw] max-h-[50vh] overflow-x-auto flex flex-row gap-10 pl-10 bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                        {producers.map((producer, idx) => (
                            <Box className='lex flex-col gap-2 items-center justify-center'>
                                <Box>
                                    <DisplayCard first_name={producer.first_name} last_name={producer.last_name} birthday={producer.birthday} />
                                </Box>
                                <Box className='flex flex-row gap-5 mt-[2vh]'>
                                {currentUser?.is_admin === true && (
                                <>
                                    <Box>
                                        <Button variant='soft' onClick={() => handleDelete(producer.id)} >
                                            { deleting === true && deletingId === producer.id ? <CircularProgress size='30px' />  : <DeleteIcon />}
                                        </Button>
                                    </Box>

                                    <Box>
                                    <Button variant='soft' onClick={() => router.push(`/producers/update/${producer.id}/`)} size='sm' color='success'>
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