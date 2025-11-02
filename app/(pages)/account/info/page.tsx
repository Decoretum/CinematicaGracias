'use client'
import Header from "@/app/Components/Header";
import { Actor, Director, Film, FilmActor, FilmProducer, Producer, Review, Users } from "@/app/Types/entitytypes";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import EditIcon from '@mui/icons-material/Edit';
import userOperation from "../../../Backend/users/operations";
import reviewOperation from "../../../Backend/reviews/operations"
import { client } from "@/app/Backend/createclient";
import { Box, Button, Textarea } from "@mui/joy";
import { CircularProgress, Modal, Snackbar, Tooltip, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowBack from "@mui/icons-material/ArrowBack";

export default function Info ({ params } : { params : Promise<{ n : number }> }) {
    const [currentUser, setCurrentUser] = useState<Users | null>(null);
    const [film, setFilm] = useState<Film>();
    const [alert, setAlert] = useState(false);
    const [message, setMessage] = useState('');
    const [director, setDirector] = useState<Director>();
    const [producers, setProducers] = useState<Array<Producer>>();
    const [actors, setActors] = useState<Array<Actor>>();
    const [reviews, setReviews] = useState<Array<Review>>()
    const [reviewing, setReviewing] = useState(false);  
    const [reviewrow, setReviewrow] = useState<Array<{ name: string, date: string, content: string, rating: number }>>([])
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    const [rateshow, setRateshow] = useState(false);
    const [rate, setRate] = useState(0);
    const [userReviewed, setUserReviewed] = useState(false);
    const navigate = useRouter();

    async function getUser(client : SupabaseClient) {
        let { getCurrentUser } = userOperation(client);
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

    async function makeReview() {
        setReviewing(true);
        let dateToday = new Date().toLocaleDateString('en-CA');
        let obj = { film_fk: film!.id, users_fk: currentUser!.id, content: text, rating: rate, date_created: dateToday };
        let { createReview } = reviewOperation(client);
        let response = await createReview(obj);
        if (response!['result'] !== 'success') {
            setMessage(response!['result']);
            setAlert(true);
            setReviewing(false);
            return;
        }

        if (response) {
            let row = {rating: response.metadata.data.rating, name: currentUser!.username, date: response.metadata.data.date, content: response.metadata.data.content};
            let rowArr = reviewrow;
            rowArr?.push(row);
            setReviewrow(rowArr);
    
            setMessage('Review Added');
            setRateshow(false);
            setAlert(true);
            setReviewing(false);
            setOpen(false);    
        }
    }

    async function formatReviews()  {
        let { getReviews } = reviewOperation(client);
        let { getUsername } = userOperation(client);
        let reviews : Array<Review> = await getReviews();
        let arr = [];
        setReviews(reviews);

        // Fetch Username and date created
        for (let i = 0; i <= reviews.length - 1; i++) {
            let review = reviews[i];
            let userName = await getUsername(review.users_fk!);
            if (review.users_fk === currentUser?.id) {
                setUserReviewed(true);
            }
            arr.push({ rating: review.rating, content: review.content, name: userName, date: review.date_created });
        }

        setReviewrow(arr);
}

    function formatText(text: Array<string>, isGenre?: boolean) : string {
        let formatted = '';
        let justOne = text.length === 1;
        let onlyTwo = text.length === 2;

        if (isGenre) {
            text = text.map((t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
        }

        if (onlyTwo) formatted += `${text[0]} and ${text[1]}`
        else if (justOne) formatted = text[0];
        else {
            for (let i = 0; i <= text.length - 1; i++) {
                let word = text[i];
                if (i === text.length - 1) formatted += `, and ${word}`;
                else if (i === text.length - 2) formatted += word;
                else formatted += `${word}, `;
            }
        }

        return formatted;
    }

    // async function getAssociated(filmId: number) : Promise<{ actors : Array<Actor>, producers : Array<Producer> }> {
    //     let actArr  = [];
    //     let prodArr = [];

    //     return { x: null  }
    // }

    useEffect(() => {
        const main = async () => {
            // Get Current User
            let { n } = await params;
            getUser(client);
            
            // Get Reviews
            let { getReviews } = reviewOperation(client);
            let reviews : Array<Review> = await getReviews(n);
            setReviews(reviews);
            console.log(reviews);
        }
        main();
    }, [])

    const firstRow = [1, 2, 3, 4, 5];
    const secondRow = [6, 7, 8, 9, 10];

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
                    <Box className='flex flex-col gap-4'>
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
                    {reviews.length === 0 ? (
                        <Box className='flex flex-col mt-[3vh] gap-5'>
                            <Box className='flex flex-row'>
                                <Typography variant='h4'> Reviews </Typography>
                            </Box>
                            {!currentUser?.is_admin ?
                                <Typography>
                                    {currentUser !== null ? 
                                    <Button onClick={() => setOpen(true)} variant='soft'>
                                        Add one
                                    </Button> : 
                                    <Button onClick={() => navigate.push('/login')} variant='soft'>
                                        Add one
                                    </Button>
                                }
                                </Typography>
                             : 
                             <Typography> Only Collaborators can provide a review </Typography>
                             }
                        </Box>
                    ) : (
                        <Box className='flex flex-col mt-[3vh] gap-5 break-words max-w-[50vw]'>
                            <Typography variant='h4'> Reviews ({ reviews.length }) </Typography>
                            {reviewrow!.map((r) => (
                            <Box className='flex flex-row gap-17'>
                                <Box className='flex flex-col gap-2 max-w-[6vw]'>
                                    <Typography variant='body2'>{r.name}  <EditIcon /> </Typography>
                                    <Typography variant='body2'>{r.date}</Typography>
                                    <Typography> {r.rating} ★ </Typography>
                                </Box>

                                <Box className='max-w-[30vw]'>
                                    {r.content}
                                </Box>
                            </Box>
                                
                        ))}
                        </Box>
                    )}
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