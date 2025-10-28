'use client'
import Header from "@/app/Components/Header";
import { Actor, Director, Producer, Users } from "@/app/Types/entitytypes";
import { SupabaseClient, User } from "@supabase/supabase-js";
import React, { ReactNode, useEffect, useState } from "react";
import userOperation from "../../../../Backend/users/operations";
import directorOperation from "../../../../Backend/directors/operations"
import filmOperation from "../../../../Backend/films/operations"
import filmActorOperation from "../../../../Backend/filmactors/operation"
import { client } from "@/app/Backend/createclient";
import { Box, Link } from "@mui/joy";
import { Button, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Tooltip from '@mui/material/Tooltip';

export default function Info ({ params } : { params : Promise<{ n : number }> }) {
    const [currentUser, setCurrentUser] = useState<Users | null>(null);
    const [director, setDirector] = useState<Director | null>(null);
    const [films, setFilms] = useState<Array<{ id: number, name: string, date_released: string }> | null>(null);
    const [alert, setAlert] = useState(false);
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    const [rateshow, setRateshow] = useState(false);
    const navigate = useRouter();

    async function getUser(client : SupabaseClient) {
        let { getCurrentUser } = userOperation(client);
        let { nonAuthUser } = await getCurrentUser();
        let nonAUser : Users = nonAuthUser === null ? null : nonAuthUser[0];
        setCurrentUser(nonAUser);
    }

    function formatText(text: Array<string> | null, isSocMed?: boolean) : string | ReactNode {
        let formatted = '';

        if (text === null) {
            return "No Social Media links";
        }

        if (isSocMed !== undefined) {
            return (
                <>
                {text.map((t, idx) => {
                    let media = t.split('||')[0];
                    let link = t.split('||')[1];
                    return (
                        <Box key={idx} className='flex flex-col'>
                            <Typography variant='subtitle2'>
                                <Box>{ media }</Box>
                                <Box className='flex-1 break-words whitespace-normal min-w-0'><Link className='block break-words whitespace-normal' fontSize={14} href={link}>{ link }</Link></Box>
                            </Typography>
                        </Box>
                    )
                    })}
                </>
            )
        }

        let justOne = text.length === 1;
        let onlyTwo = text.length === 2;

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

    async function getAssociated() : Promise<Array<{ id: number, name: string, date_released: string }>> {

        let { n } = await params;

        // Get Films associated
        let { getFilms } = filmOperation(client);
        let filmArr : { id: number, name: string, date_released: string }[] = [];

        let films = await getFilms(n);

        for (let i = 0; i <= films.length - 1; i++) {
            let film = films[i];
            filmArr.push({ id: film.id, name: film.name, date_released: film.date_released });
        }
        
        return filmArr;
    }

    useEffect(() => {
        const main = async () => {
            getUser(client);

            // Fetch Director
            let { n } = await params;
            let { getDirector } = directorOperation(client);
            let query = await getDirector(n);
            setDirector(query);

            
            // Set Films
            let filmArr = await getAssociated();
            setFilms(filmArr);
        }
        main();
    }, [])

    if (!director || !films) {
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
                <Box className='flex flex-row justify-between'>
                    <Box className='max-w-[30vw]'>
                        <Typography variant='h3'>
                            { director.first_name } { director.last_name }
                        </Typography>
                    </Box>
                    <Box>
                    <Tooltip title='Back to Director Page'>
                        <Button variant='outlined' onClick={() => navigate.push('/directors')}>
                            <ArrowBackIcon />
                        </Button>
                    </Tooltip>
                    </Box>
                </Box>

                <Box><Typography variant='h6'>Sex: { director.sex.toUpperCase() }</Typography></Box>
                <Box className='flex flex-row justify-between'>
                    <Typography>Birthdate: { new Date(director.birthday).toDateString().substring(4) }</Typography>
                </Box>

                <Box className='flex flex-col gap-4 mt-[4vh]'>
                    <Typography variant='h4'> Overview </Typography>
                    <Typography variant='body2'> { director.description } </Typography>
                </Box>

                <Box className='flex flex-row gap-20 mt-[4vh]'>
                    <Box className='max-w-[40vw]'>
                        <Typography variant='h5'>Films Directed</Typography>
                        <Box className='mt-[2vh]'>
                            { films.length !== 0 ? films.map((f, idx) => (
                                <React.Fragment>
                                    <Link
                                    key = {idx}
                                    component='address'
                                    onClick={() => { navigate.push(`/films/view/${f.id}`) }}
                                    >
                                        { f.name } ({ new Date(f.date_released).getFullYear().toString() })
                                    </Link>
                                    { idx < films.length - 1 && ", " } 
                                </React.Fragment>
                            )) : (
                                <Typography variant='subtitle2'> No films as of the moment </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>


            </Box>
        </>
    )
}