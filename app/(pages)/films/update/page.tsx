'use client'
import { client } from "@/app/Backend/createclient";
import { Genre, IngestData } from "@/app/Types/films/filmtypes";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Textarea } from "@mui/joy";
import Input from '@mui/joy/Input';
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, Modal } from '@mui/material';
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from '@mui/material/Snackbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from "@mui/material/Typography";
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import actorOperations from '../../../Backend/actors/operations';
import directorOperations from '../../../Backend/directors/operations';
import operations from '../../../Backend/films/operations';
import producerOperations from '../../../Backend/producers/operations';
import Header from '../../../Components/Header';
import { FilmGenres } from '../../../Helpers/FilmGenres';

export default function CreateFilm () {
    const [description, setDescription] = useState('');
    const [date, setDate] = useState<Date | null>(new Date());
    const [filmGenres, setFilmGenres] = useState<Array<Genre>>([]);
    const [genres, setGenres] = useState([]);
    const [genreShow, setGenreShow] = useState(false);
    const [contentRating, setContentRating] = useState('');
    const [directorfk, setDirectorfk] = useState(0);
    const [duration, setDuration] = useState(0);
    const [framerate, setFramerate] = useState(0);
    const [name, setName] = useState('');
    const [alert, setAlert] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [actorShow, setActorShow] = useState(false);
    const [producerShow, setProducerShow] = useState(false);
    const [directorShow, setDirectorShow] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [directors, setDirectors] = useState<IngestData[]>([]);
    const [producers, setProducers] = useState<IngestData[]>([]);
    const [actors, setActors] = useState<IngestData[]>([]);
    const { getDirectors } = directorOperations(client);
    const { getActors } = actorOperations(client);
    const { getProducers } = producerOperations(client);
    const router = useRouter();

    function handleGenreChange(id: number) {
        let newArr = [];
        for (let i = 0; i <= filmGenres.length - 1; i++){
            let curr : Genre = filmGenres[i];
            let checked = curr.checked;
            if (curr.id === id) {
                if (checked === 1) checked = 0;
                else checked = 1;
            }
            newArr.push({id: curr.id, name: curr.name, checked: checked});
        }
        setFilmGenres(newArr);
    }

    function handleChange(id: number, type: string) {
        let newArr = [];
        if (type === 'director') {
            for (let i = 0; i <= directors.length - 1; i++){
                let curr = directors[i];
                let checked = 0;
                if (curr.id === id) {
                    checked = 1;
                }
                newArr.push({id: curr.id, name: curr.name, checked: checked});
            }
            setDirectors(newArr);
        } else if (type === 'producer') {
            for (let i = 0; i <= producers.length - 1; i++){
                let curr = producers[i];
                let checked = curr.checked;
                if (curr.id === id) {
                    if (checked === 1) checked = 0
                    else checked = 1
                }
                newArr.push({id: curr.id, name: curr.name, checked: checked});
            }
            setProducers(newArr);
        } else {
            for (let i = 0; i <= actors.length - 1; i++){
                let curr = actors[i];
                let checked = curr.checked;
                if (curr.id === id) {
                    if (checked === 1) checked = 0
                    else checked = 1
                }
                newArr.push({id: curr.id, name: curr.name, checked: checked});
            }
            setActors(newArr);
        }
    }

    useEffect(() => {
        const main = async () => {
            let directors = await getDirectors();
            let actors = await getActors();
            let producers = await getProducers();

            let dArr = [];
            let pArr = [];
            let aArr = [];
            let gArr : Array<any> = [];

            for (let i = 0; i <= directors.data.length - 1; i++) {
                dArr.push({id: directors.data[i].id, name: directors.data[i].first_name + " " + directors.data[i].last_name, checked: 0});
            }

            for (let i = 0; i <= producers.data.length - 1; i++) {
                pArr.push({id: producers.data[i].id, name: producers.data[i].first_name + " " + producers.data[i].last_name, checked: 0});
            }

            for (let i = 0; i <= actors.data.length - 1; i++) {
                aArr.push({id: actors.data[i].id, name: actors.data[i].first_name + " " + actors.data[i].last_name, checked: 0});
            }

            for (let i = 0; i <= FilmGenres.length - 1; i++) {
                gArr.push({id:i, name: FilmGenres[i], checked: 0});
            }

            setDirectors(dArr);
            setActors(aArr);
            setProducers(pArr);
            setFilmGenres(gArr);
            setPageLoading(false);
        }

        main();
    }, [])

    async function create() {
        let finalDate = date!.toLocaleDateString('en-CA');
        let finalActors = [];
        let finalProducers = [];
        let finalDirector = directors[0].id;
        let finalGenres = [];
        for (let i = 0; i <= actors.length - 1; i++) {
            if(actors[i].checked === 1) finalActors.push(actors[i].id);
        }
        for (let i = 0; i <= producers.length - 1; i++) {
            if(producers[i].checked === 1) finalProducers.push(producers[i].id);
        }
        for (let i = 0; i <= filmGenres.length - 1; i++) {
            if (filmGenres[i].checked === 1) finalGenres.push(filmGenres[i].name.toLowerCase());
        }
        
        const obj = {
            description: description,
            content_rating: contentRating,
            name: name,
            date_released: finalDate,
            duration: duration,
            frame_rate: framerate,
            genres: finalGenres,
            director_fk: finalDirector,
            actors: finalActors,
            producers: finalProducers
        }

        const { createFilm } = operations(client);
        setLoading(true);
        let hashmap = await createFilm(obj);
        console.log(hashmap);
        if (hashmap.result !== 'success') {
            setMessage(hashmap.result);
            setAlert(true);
            setLoading(false);
        }
        
        else {
            router.push('/films');
            return;   
        }
    }

    if (pageLoading === true) {
        return(
            <>
                <Header currentUser={ undefined } />
                <Box className='flex h-screen items-center justify-center'>
                    <Box className='flex flex-col justify-center items-center mx-auto h-[15vh] md:w-[50vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm rounded-lg'>
                        Loading Director, Producer, and Actor Data
                        <CircularProgress className='mt-4' color='secondary' /> 
                    </Box>
                </Box>

            </>
        )
    }

    return(
        <>
            <Header currentUser={ undefined } />
            <Box className='flex flex-col justify-center items-center mx-auto md:w-[50vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                
                <Box className='flex flex-row'>
                    <Box className='mr-[2vw]'>
                        <Tooltip title='Back to Film Page'>
                            <Button variant='contained'>
                                <ArrowBackIcon />
                            </Button>
                        </Tooltip>
                    </Box>

                    <Typography color='white' variant='h5'> Add a Film</Typography>
                </Box>

                <Box className='flex flex-row mt-[5vh]'>
                    <Box className='flex flex-col'>
                        <Typography color='white'> Name </Typography>
                        <Input placeholder='Movie Name' onChange={(event) => setName(event.target.value)} />
                    </Box>

                    <Box className='flex flex-col ml-[4vw]'>
                        <Typography color='white'> Content Rating </Typography>
                        <Input placeholder='Maturity Rating' onChange={(event) => setContentRating(event.target.value)} />
                    </Box>
                </Box>

                <Box className='flex flex-row mt-[5vh]'>

                    <Box className='flex flex-col'>
                        <Typography color='white'> Duration </Typography>
                        <Input type='number' placeholder='In Minutes' onChange={(event) => setDuration(Number(event.target.value))} />
                    </Box>

                    <Box className='flex flex-col ml-[4vw] mt-[0.5vh]'>
                        <Typography color='white'> Date Released </Typography>
                        <DatePicker 
                            selected={ date } 
                            onChange= {(date) => {
                                setDate(date);
                            }}
                            customInput={
                                <input className='bg-white rounded-lg h-[5vh] text-black p-3 font-sans' />
                            }
                        />
                    </Box>
                </Box>

                <Box className='flex flex-row mt-[4vh] gap-18'>
                    <Box className='flex flex-col mr-[11vw]'>
                        <Typography color='white'> Framerate </Typography>
                        <Input placeholder='Frames per Second' type='number' onChange={(event) => setFramerate(Number(event.target.value))} />
                    </Box>
                    
                    <Box className='flex flex-col ml-[-5vw]'>
                        <Typography color='white'> Genres </Typography>
                        <Button variant='contained' onClick={() => setGenreShow(true)}> Choose </Button>
                        <Modal
                            open={genreShow}
                            onClose={() => setGenreShow(false)}
                            disableScrollLock={true}
                            >
                                <Box className='w-[40vw] overflow-y-auto max-h-[80vh] p-6 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-[#1e1e1e] text-white rounded-lg shadow-xl'>
                                    <Typography variant="h6" component="h2">
                                        List of Directors
                                    </Typography>
                                    <Typography sx={{ mt: 2 }}>
                                        You can only choose 1 director
                                    </Typography>
                                    <Box>
                                    <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                                        <FormGroup>
                                        {filmGenres.map((genre, idx) => (
                                                <FormControlLabel
                                                control={
                                                <Checkbox checked={genre.checked === 0 ? false : true} onChange={() => handleGenreChange(genre.id)} name={genre.name} />
                                                }
                                                label={genre.name}
                                                />
                                        ))}
                                        </FormGroup>
                                    </FormControl>
                                    </Box>
                                </Box>
                        </Modal>
                    </Box>

                    
                </Box>

                <Box className='flex flex-col mt-[6vh] gap-13'>

                    <Box className='flex flex-row gap-25 items-center justify-center'>

                        <Box>

                            <Box>
                                <Typography color='white'> Director </Typography>
                            </Box>

                            <Box className='mt-[2vh]'>
                                <Button onClick={() => setDirectorShow(true)} variant='contained'> Choose </Button>
                            </Box>

                            <Modal
                            open={directorShow}
                            onClose={() => setDirectorShow(false)}
                            disableScrollLock={true}
                            >
                                <Box className='w-[40vw] overflow-y-auto max-h-[80vh] p-6 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-[#1e1e1e] text-white rounded-lg shadow-xl'>
                                    <Typography variant="h6" component="h2">
                                        List of Directors
                                    </Typography>
                                    <Typography sx={{ mt: 2 }}>
                                        You can only choose 1 director
                                    </Typography>
                                    <Box>
                                    <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                                        <FormGroup>
                                        {directors.map((director, idx) => (
                                                <FormControlLabel
                                                control={
                                                <Checkbox checked={director.checked === 0 ? false : true} onChange={() => handleChange(director.id, 'director')} name={director.name} />
                                                }
                                                label={director.name}
                                                />
                                        ))}
                                        </FormGroup>
                                    </FormControl>
                                    </Box>
                                </Box>
                            </Modal>
                        </Box>

                        <Box>
                            <Box>
                                <Typography color='white'> Producer </Typography>
                            </Box>
                            <Box className='mt-[2vh]'>
                                <Button onClick={() => setProducerShow(true)} variant='contained'> Choose </Button>
                            </Box>
                            <Modal
                            open={producerShow}
                            onClose={() => setProducerShow(false)}
                            disableScrollLock={true}
                            >
                                <Box className='w-[40vw] overflow-y-auto max-h-[80vh] p-6 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-[#1e1e1e] text-white rounded-lg shadow-xl'>
                                    <Typography variant="h6" component="h2">
                                        List of Producers
                                    </Typography>
                                    <Typography sx={{ mt: 2 }}>
                                        You can choose multiple Producers
                                    </Typography>
                                    <Box>
                                    <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                                        <FormGroup>
                                        {producers.map((producer, idx) => (
                                                <FormControlLabel
                                                control={
                                                <Checkbox checked={producer.checked === 1 ? true : false} onChange={() => handleChange(producer.id, 'producer')} name={producer.name} />
                                                }
                                                label={producer.name}
                                                />
                                        ))}
                                        </FormGroup>
                                    </FormControl>
                                    </Box>
                                </Box>
                            </Modal>
                        </Box>

                        <Box>
                            <Box>
                                <Typography color='white'> Actor </Typography>
                            </Box>
                            <Box className='mt-[2vh]'>
                                <Button onClick={() => setActorShow(true)} variant='contained'> Choose </Button>
                            </Box>
                            <Modal
                            open={actorShow}
                            onClose={() => setActorShow(false)}
                            disableScrollLock={true}
                            >
                                <Box className='w-[40vw] overflow-y-auto max-h-[80vh] p-6 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-[#1e1e1e] text-white rounded-lg shadow-xl'>
                                    <Typography variant="h6" component="h2">
                                        List of Actors
                                    </Typography>
                                    <Typography sx={{ mt: 2 }}>
                                        You can choose multiple Actors
                                    </Typography>
                                    <Box>
                                    <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                                        <FormGroup>
                                            {actors.map((actor, idx) => (
                                                <FormControlLabel
                                                control={
                                                <Checkbox checked={actor.checked === 0 ? false : true} onChange={() => handleChange(actor.id, 'actor')} name={actor.name} />
                                                }
                                                label={actor.name}
                                                />
                                        ))}
                                        </FormGroup>
                                    </FormControl>
                                    </Box>
                                </Box>
                            </Modal>
                        </Box>
                    </Box>

                    <Box className=''>
                        <Typography color='white'> Description / Biography </Typography>
                        <Textarea
                        value={description}
                        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value)}
                        placeholder="Write a description for the Film"
                        className='mt-[2vh] w-[38vw]'
                        minRows={7}
                        maxRows={15}
                        endDecorator = {
                            <Typography variant='body2' sx={{ ml: 'auto' }}>
                                {description.length} character(s)
                            </Typography>
                        }
                        />
                    </Box>
                </Box>

                <Box className='mt-[2vh]'>
                    <Button 
                    variant='contained' 
                    disabled = {loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                    onClick={create}
                    >
                        {loading ? null : 'Create'}
                    </Button>
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