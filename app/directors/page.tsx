'use client'
import { Box, Button, Typography } from "@mui/joy";
import userOperation from "../Backend/users/operations";
import filmOperation from "../Backend/films/operations";
import { useEffect, useState } from "react";
import createclient from "../Backend/createclient";
import Dropdown from '../Components/Dropdown'
import Header from '../Components/Header'


export default function Directors () {
    const [currentUser, setCurrentUser] = useState({});
    const [films, setFilms] = useState({});

    async function getUser(client : object) {
        let { getCurrentUser } = await userOperation(client);
        let currUser = await getCurrentUser();
        setCurrentUser(currUser);
        console.log(currentUser)
    }

    async function getDirectors(client : object) {
        let { getFilms } = filmOperation(client);
        let filmData = await getFilms();
        setFilms(filmData.data);
        console.log(filmData);
        
    }

    useEffect(() => {
        const mainFunction = async () => {
            let client = createclient();
            getUser(client);
            getDirectors(client);
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
                    (films.length === 0 && currentUser === null) ? (
                        <Box className='flex flex-col items-center justify-center md:ml-[5vw] md:w-[30vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                        <Typography color='white'> There are no movies stored in the site as of the moment </Typography>
                    </Box>
                    ) :
                    (films.length === 0 && currentUser.is_admin === true) ? (
                    <Box className='flex flex-col items-center justify-center md:ml-[5vw] md:w-[30vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                        <Typography color='white'> There are no movies stored in the site. Add a Film through the button below </Typography>
                        <Box className='mt-[3vh]'>
                            <Button color='neutral' variant='soft'> Add Film </Button>
                        </Box>
                    </Box>
                    ) : 
                    (films.length === 0 && currentUser.is_admin === false) ? (
                    <Box className='flex flex-col items-center justify-center md:ml-[5vw] md:w-[30vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                        <Typography color='white'> There are no movies stored in the site as of the moment </Typography>
                    </Box>
                    )
                    : (
                    <>

                    </>
                    )
                    }
                </Box>
            </Box>
        </>
    )
    
}