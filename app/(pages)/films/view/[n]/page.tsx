'use client'
import Header from "@/app/Components/Header";
import { Actor, Director, Film, FilmActor, FilmProducer, Producer, Review, Users } from "@/app/Types/entitytypes";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import EditIcon from '@mui/icons-material/Edit';
import producerOperation from "../../../../Backend/producers/operations";
import userOperation from "../../../../Backend/users/operations";
import filmOperation from "../../../../Backend/films/operations"
import actorOperation from "../../../../Backend/actors/operations"
import reviewOperation from "../../../../Backend/reviews/operations"
import directorOperation from "../../../../Backend/directors/operations"
import filmProducerOperation from "../../../../Backend/filmproducers/operation"
import filmActorOperation from "../../../../Backend/filmactors/operation"
import { client } from "@/app/Backend/createclient";
import { Box, Button, Textarea } from "@mui/joy";
import { CircularProgress, FormControl, Modal, Snackbar, Tooltip, Typography } from "@mui/material";
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

    async function getUser() {
        let { getCurrentUser } = await userOperation(client);
        let { nonAuthUser } = await getCurrentUser();
        let nonAUser : Users = nonAuthUser === null ? null : nonAuthUser[0];
        setCurrentUser(nonAUser);
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
        let { getUsername } = await userOperation(client);
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

    async function getAssociated(filmId: number) : Promise<{ actors : Array<Actor>, producers : Array<Producer> }> {
        let { getFilmProducers } = filmProducerOperation(client);
        let { getFilmActors } = filmActorOperation(client);
        let { getProducer } = producerOperation(client);
        let { getActor} = actorOperation(client);
        let filmprod : Array<FilmProducer> = await getFilmProducers(filmId);
        let filmactor : Array<FilmActor> = await getFilmActors(filmId);
        let actArr  = [];
        let prodArr = [];

        // Get producers associated
        for (let i = 0; i <= filmprod.length - 1; i++) {
            let prodId = filmprod[i].producer_fk;
            let prod = await getProducer(prodId!);
            prodArr.push(prod);
        }

        // Get Actors associated
        for (let i = 0; i <= filmactor.length - 1; i++) {
            let actorId = filmactor[i].actor_fk;
            let actor : Actor = await getActor(actorId!);
            actArr.push(actor);
        }

        return { actors : actArr,  producers: prodArr }
    }

    useEffect(() => {
        const main = async () => {
            getUser();

            // Format Film
            let { n } = await params;
            let { getFilm } = filmOperation(client);
            let query = await getFilm(n);
            setFilm(query);

            // Get Director
            let { getDirector } = directorOperation(client);
            let director : Director = await getDirector(query.director_fk!);
            setDirector(director);
            
            // Format Producers and Actors
            let { actors, producers } = await getAssociated(query.id);

            setActors(actors);
            setProducers(producers);

            // Fetch Reviews
            formatReviews();
            
        }
        main();
    }, [])

    const firstRow = [1, 2, 3, 4, 5];
    const secondRow = [6, 7, 8, 9, 10];

    if (!film || !producers || !actors || !director || !reviews) {
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
            <Box className='break-words flex flex-col gap-5 md:min-h-[100vh] md:max-w-[50vw] w-[50vw] mx-auto bg-black/30 p-6 rounded-lg text-white backdrop-blur-sm'>
                <Box className='flex flex-row justify-between'>
                    <Typography variant='h3'>
                        { film.name }
                    </Typography>
                    <Box className='flex flex-col gap-4'>
                        <Box>
                            <Tooltip title='Back to Film Page'>
                            <Button variant='outlined' onClick={() => navigate.push('/films')}>
                                <ArrowBack />
                            </Button>
                            </Tooltip>
                        </Box>

                        <Box>
                            <Typography>
                                { film.duration } minutes
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box><Typography variant='h6'>Average Rating: { film.average_user_rating } / 10 ★</Typography></Box>
                <Box className='flex flex-row justify-between'>
                    <Typography>Released on { film.date_released }</Typography>
                    <Typography>Directed by {`${director.first_name} ${director.last_name}`} </Typography>
                </Box>
                <Box className='flex flex-row justify-between max-w-[50vw] mt-[4vh]'>
                    <Box className='max-w-[8vw]'>
                        <Typography>Maturity Rating: { film.content_rating }
                        <ReportGmailerrorredIcon className='ml-[0.5vw] mb-[1vh]' />
                        </Typography>
                    </Box>
                    <Typography>Framerate of { film.frame_rate }</Typography>
                </Box>

                <Box className='flex flex-col gap-4 mt-[4vh]'>
                    <Typography variant='h4'> Overview </Typography>
                    <Typography variant='body2'> {film.description} </Typography>
                </Box>

                <Box className='mt-[4vh]'>
                    <Typography variant='h5'>Genres</Typography>
                    <Box className='mt-[2vh]'>
                        <Typography variant='body2'>{ formatText(film.genres, true) } </Typography>
                    </Box>
                </Box>

                <Box className='flex flex-row mt-[4vh] gap-20 justify-center'>
                    <Box className='max-w-[20vw]'>
                        <Typography variant='h5'>Producers</Typography>
                        <Box className='mt-[2vh]'>
                            <Typography variant='body2'>{ formatText(extractText(producers)) } </Typography>
                        </Box>
                    </Box>
                    <Box className='max-w-[20vw]'>
                        <Typography variant='h5'>Actors</Typography>
                        <Box className='mt-[2vh]'>
                            <Typography variant='body2'>{ formatText(extractText(actors)) } </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box className='mt-[2vh] max-w-[40vw]'>
                    {reviewrow.length === 0 ? (
                        <Box className='flex flex-col mt-[3vh] gap-5'>
                            <Box className='flex flex-row'>
                                <Typography variant='h4'> Reviews </Typography>
                            </Box>
                            <Typography>There are no reviews for this film yet</Typography>
                            {!currentUser?.is_admin &&
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
                            }
                        </Box>
                    ) : (
                        <Box className='flex flex-col mt-[3vh] gap-5 break-words max-w-[50vw]'>
                            <Typography variant='h4'> Reviews </Typography>
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

                <Modal
                    open={open}
                    onClose={() => setOpen(false)}
                    disableScrollLock={true}
                    >
                        <Box className='w-[40vw] overflow-y-auto max-h-[80vh] flex flex-col gap-4 p-6 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-[#1e1e1e] text-white rounded-lg shadow-xl'>
                            <Box className='flex flex-row gap-65'>
                                <Box className='max-w-[12vw]'>
                                    <Typography variant="h6" component="h2">
                                        Write a Review
                                    </Typography>
                                </Box>
                                <Box className='max-w-[5vw]'>
                                    <Button onClick={() => setRateshow(true)}>
                                        <Typography>
                                            Rate
                                        </Typography>
                                    </Button>
                                </Box>
                            </Box>
                            <Typography sx={{ mt: 2 }} variant='subtitle2'>
                                The review should contain at least 200 characters
                            </Typography>
                            <Box className='mt-[2vh]'>
                                <Textarea
                                    placeholder='Type here...'
                                    minRows={9}
                                    maxRows={11}
                                    onChange={(event) => setText(event.target.value)}
                                    value ={text}
                                    endDecorator={
                                        <Box className='p-1 flex w-[100%] justify-end items-end'>
                                            <Typography variant='subtitle2'>
                                                {text.length} characters
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </Box>
                            <Box>
                                <Button loading={reviewing} 
                                sx= {{
                                    backgroundColor: '#10b981', 
                                    color: 'black', 
                                    '&:hover': {backgroundColor: '#047857'},
                                    '&.Mui-disabled': {backgroundColor: '#047857'}
                                }} 
                                    color={reviewing ? 'warning' : 'primary'} onClick={() => setRateshow(true)}> 
                                    Add Review 
                                </Button>
                            </Box>
                        </Box>
                </Modal>

                <Modal
                    open={rateshow}
                    onClose={() => setRateshow(false)}
                    disableScrollLock={true}
                    >
                        <Box className='w-[40vw] overflow-y-auto max-h-[80vh] flex flex-col gap-4 p-6 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-[#1e1e1e] text-white rounded-lg shadow-xl'>
                            <Box className='flex flex-row gap-80'>
                                <Box className='max-w-[12vw]'>
                                    <Typography variant="h6" component="h2">
                                        Rate
                                    </Typography>
                                </Box>
                                <Box className='max-w-[20vw]'>
                                    <Button onClick={() => setRateshow(false)}>
                                        <Typography>
                                            Back to Review
                                        </Typography>
                                    </Button>
                                </Box>
                            </Box>
                            <Box className='flex flex-col items-center justify-center'>
                                <Box className='mt-[5vh] flex flex-row gap-5'>
                                    {firstRow.map((r) => (
                                        <Button disabled={rate === r ? true : false} onClick={() => setRate(r)}> {r} </Button>
                                    ))}
                                    
                                </Box>
                                <Box className='mt-[5vh] flex flex-row gap-5'>
                                    {secondRow.map((r) => (
                                        <Button disabled={rate === r ? true : false} onClick={() => setRate(r)}> {r} </Button>
                                    ))}
                                </Box>
                            </Box>
                            <Box className='mt-[5vh]'>
                                <Button loading={reviewing} 
                                sx= {{
                                    backgroundColor: '#10b981', 
                                    color: 'black', 
                                    '&:hover': {backgroundColor: '#047857'},
                                    '&.Mui-disabled': {backgroundColor: '#047857'}
                                }} 
                                    color={reviewing ? 'warning' : 'primary'} onClick={makeReview}> 
                                    Submit Review 
                                </Button>
                            </Box>
                        </Box>
                </Modal>

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