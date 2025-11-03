'use client'
import Header from "@/app/Components/Header";
import { Actor, Director, Film, FilmActor, FilmProducer, Producer, Review, Users } from "@/app/Types/entitytypes";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import userOperation from "../../../Backend/users/operations";
import filmOperation from "../../../Backend/films/operations";
import reviewOperation from "../../../Backend/reviews/operations"
import { client } from "@/app/Backend/createclient";
import { Box, Button, Link, Textarea } from "@mui/joy";
import { CircularProgress, Modal, Snackbar, Tooltip, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowBack from "@mui/icons-material/ArrowBack";

export default function Info ({ params } : { params : Promise<{ n : number }> }) {
    const [currentUser, setCurrentUser] = useState<Users | null>(null);
    const [alert, setAlert] = useState(false);
    const [message, setMessage] = useState('');
    const [reviews, setReviews] = useState<Array<Review>>()
    const [reviewrow, setReviewrow] = useState<Array<{ name: string, filmName: string, filmId: number, date: string, rating: number }> | null>(null)
    const navigate = useRouter();

    async function getUser() {
        let { getCurrentUser } = await userOperation(client);
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

    async function formatReviews()  {
        let { getReviews } = reviewOperation(client);
        let { getUsername } = await userOperation(client);
        let { getFilm } = await filmOperation(client);
        let reviews : Array<Review> = await getReviews();
        let arr = [];
        setReviews(reviews);

        // Fetch Username and date created
        for (let i = 0; i <= reviews.length - 1; i++) {
            let review = reviews[i];
            let userName = await getUsername(review.users_fk!);
            let film : Film = await getFilm(review.film_fk!);
            arr.push({ rating: review.rating, content: review.content, name: userName, filmName: film.name, filmId: review.film_fk!, date: review.date_created });
        }

        setReviewrow(arr);
}


    useEffect(() => {
        const main = async () => {
            // Get Current User
            let { n } = await params;
            getUser();
            
            // Get Reviews
            formatReviews();
        }
        main();
    }, [])

    if (!currentUser || !reviews) {
        return(
            <>
                <Header currentUser={ undefined } />
                <Box className='flex h-screen items-center justify-center'>
                    <Box className='flex flex-col justify-center items-center mx-auto h-[15vh] md:w-[50vw] bg-black/30 p-6 rounded-lg text-white backdrop-blur-sm rounded-lg'>
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
            <Box className='flex flex-col gap-6 md:min-h-[100vh] break-words md:max-w-[50vw] mx-auto bg-black/30 p-6 rounded-lg text-white backdrop-blur-sm'>
                <Box className='flex flex-row justify-between'>
                    <Typography variant='h3'>
                        Profile
                    </Typography>
                    <Box className='flex flex-row gap-10'>
                        <Box>
                            <Button variant='soft' onClick={() => navigate.push('/account/update')}>
                                <Box className='flex flex-row items-center gap-2'>
                                    <Box><EditIcon /></Box>
                                    <Box>Edit Account Details</Box>
                                </Box>
                            </Button> 
                        </Box>

                        <Box>
                            <Tooltip title='Back to Film Page'>
                            <Button variant='outlined' onClick={() => navigate.push('/films')}>
                                <ArrowBack />
                            </Button>
                            </Tooltip>
                        </Box>
                    </Box>
                </Box>

                <Box className='mt-[4vh]'><Typography variant='h4'>  Name: { currentUser.first_name }  { currentUser.last_name }</Typography></Box>

                <Box><Typography variant='h6'> Username: { currentUser.username } </Typography></Box>

                <Box className='flex flex-row justify-between mt-[4vh]'>
                    <Box className='max-w-[20vw]'>
                        <Typography>
                            User ID: { currentUser.id }
                        </Typography>
                    </Box>

                    <Box>
                        <Typography>Role: { currentUser.is_admin ? 'Administrator' : 'Collaborator' }</Typography>
                    </Box>
                </Box>

                <Box>
                    <Typography>Sex: { currentUser.sex.toUpperCase() }</Typography>
                </Box>

                <Box>
                    <Typography>Date of Birth: { new Date(currentUser.birthday).toDateString()  }</Typography>
                </Box>

                <Box className='mt-[2vh] max-w-[40vw]'>
                    <Typography variant='h4'> Reviews </Typography>
                    {!currentUser?.is_admin ?
                            <Box>
                                { reviews.length === 0 ? 
                                <Box className='flex flex-row items-center gap-3 mt-[3vh]'>
                                    <Box>
                                        No reviews given
                                    </Box>

                                    <Box>
                                        <Button onClick={() => navigate.push('/films')} variant='solid'>
                                            Browse Films
                                        </Button>
                                    </Box>

                                </Box>
                                : 
                                <Box className='flex flex-row mt-[3vh] gap-5 break-words max-w-[50vw]'>
                                    { reviewrow === null ? 
                                    <Box className='flex flex-row items-center gap-5'>
                                        <Box>
                                            <Typography variant='body2'>Retrieving Reviews</Typography>
                                        </Box>
                                        <Box>
                                            <CircularProgress className='mt-4' color='secondary' />
                                        </Box> 
                                    </Box>
                                    

                                    : reviewrow!.map((r, idx) => (
                                    <Box className='flex flex-col gap-17'>
                                        <Box key={idx} className='flex flex-row gap-8 items-center'>
                                            <Box>
                                                <Typography> {r.rating} ★ </Typography>
                                            </Box>
                                            <Box>
                                                <Link
                                                component='address'
                                                color='warning'
                                                onClick={() => { navigate.push(`/films/view/${r.filmId}`) }}
                                                >
                                                    <Typography variant='body2'>{r.filmName}</Typography>
                                                </Link>
                                            </Box>
                                            <Box>
                                                <Typography variant='body2'>Last Reviewed on: {r.date}</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    )) }
                                </Box>
                                 }
                            </Box>
                        : 
                        <Typography> Only Collaborators can provide a review </Typography>
                    }
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