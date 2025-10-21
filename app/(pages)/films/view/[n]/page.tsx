'use client'
import Header from "@/app/Components/Header";
import { Film, Users } from "@/app/Types/entitytypes";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import userOperation from "../../../../Backend/users/operations";
import filmOperation from "../../../../Backend/films/operations"
import { client } from "@/app/Backend/createclient";
import { Box } from "@mui/joy";
import { CircularProgress, Snackbar, Typography } from "@mui/material";

export default function Info ({ params } : { params : Promise<{ n : number }> }) {
    const [currentUser, setCurrentUser] = useState<Users | null>(null);
    const [film, setFilm] = useState<Film>();
    const [pageloading, setPageLoading] = useState(true);
    const [alert, setAlert] = useState(false);
    const [message, setMessage] = useState('');

    async function getUser(client : SupabaseClient) {
        let { getCurrentUser } = userOperation(client);
        let { nonAuthUser } = await getCurrentUser();
        let nonAUser : Users = nonAuthUser === null ? null : nonAuthUser[0];
        setCurrentUser(nonAUser);
        console.log(nonAUser);
    }

    useEffect(() => {
        const main = async () => {
            getUser(client);
            setPageLoading(true);
            let { n } = await params;
            let { getFilm } = filmOperation(client);
            let query = await getFilm(n);
            setFilm(query);
            console.log(query)
        }
        main();
        setPageLoading(false);
    }, [])


    if (pageloading === true && film === undefined) {
        return(
            <>
                <Header currentUser={ undefined } />
                <Box className='flex h-screen items-center justify-center'>
                    <Box className='flex flex-col justify-center items-center mx-auto h-[15vh] md:w-[50vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm rounded-lg'>
                        Loading Film Data
                        <CircularProgress className='mt-4' color='secondary' /> 
                    </Box>
                </Box>
            </>
        )
    }



    return (
        <>
            <Header currentUser={ currentUser } />
            <Box className='flex flex-col justify-center items-center mx-auto md:w-[50vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                <Typography>
                    { film!.name }
                </Typography>
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