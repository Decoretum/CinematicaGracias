'use client'
import { client } from "@/app/Backend/createclient";
import { FilmCreate, Genre, IngestData } from "@/app/Types/films/filmtypes";
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
import actorOperations from '../../../../Backend/actors/operations';
import directorOperations from '../../../../Backend/directors/operations';
import filmOperations from '../../../../Backend/films/operations';
import producerOperations from '../../../../Backend/producers/operations';
import filmProducerOperations from '../../../../Backend/filmproducers/operation';
import filmActorOperations from '../../../../Backend/filmactors/operation';
import Header from '../../../../Components/Header';
import { FilmGenres } from '../../../../Helpers/FilmGenres';
import DataComparator from "@/app/Helpers/DataComparator";
import { Actor, Director, Film, Producer } from "@/app/Types/entitytypes";

export default function UpdateFilm ({ params } : { params: Promise<{n : number}>}) {
    const [film, setFilm] = useState<Film>();
    const [description, setDescription] = useState('');
    const [date, setDate] = useState<Date | null>(new Date());
    const [filmGenres, setFilmGenres] = useState<Array<Genre>>([]);
    const [genreShow, setGenreShow] = useState(false);
    const [contentRating, setContentRating] = useState<string | ''>('');
    const [directorfk, setDirectorfk] = useState(0);
    const [duration, setDuration] = useState(0);
    const [framerate, setFramerate] = useState<number | 0 >(0);
    const [id, setId] = useState<number>(0);
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
    const [initialState, setInitialState] = useState<FilmCreate>({'content_rating': null, 'genres': [], 'actors': [], 'producers': [], 'description': '', 'name': '', 'director_fk': 0, 'duration': 0, 'frame_rate': 0, 'date_released': '' });
    const { getDirectors } = directorOperations(client);
    const { getActors } = actorOperations(client);
    const { getProducers } = producerOperations(client);
    const { getFilm } = filmOperations(client);
    const { getFilmActor } = filmActorOperations(client);
    const { getFilmProducer } = filmProducerOperations(client);
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
                    setDirectorfk(id);
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
            const { n } = await params;
            let film : Film = await getFilm(n);
            let directorQuery = await getDirectors();
            let actorQuery = await getActors();
            let producerQuery = await getProducers();
            let dFk = 0;
            let dArr = [];
            let pArr = [];
            let aArr = [];
            let gArr : Array<any> = [];

            for (let i = 0; i <= FilmGenres.length - 1; i++) {
                // let genre = FilmGenres[i].charAt(0).toUpperCase() + FilmGenres[i].slice(1).toLowerCase();
                let genre = FilmGenres[i];
                let checked = 0;

                if (film!.genres.includes(genre)) checked = 1;
                else checked = 0;
                gArr.push({id:i, name: FilmGenres[i], checked: checked});
            }
            
            for (let i = 0; i <= directorQuery.data.length - 1; i++) {
                let director : Director = directorQuery.data[i];
                let checked = 0;

                if (director.id === film!.director_fk) {
                    setDirectorfk(director.id);
                    dFk = director.id;
                    checked = 1;
                }
                else checked = 0;
                dArr.push({id: director .id, name: director.first_name + " " + director .last_name, checked: checked});
            }

            for (let i = 0; i <= producerQuery.length - 1; i++) {
                let prod : Producer = producerQuery[i];
                let queried = await getFilmProducer(film!.id, prod.id);
                let checked = 0;

                if (queried !== null) checked = 1;
                else checked = 0;
                pArr.push({id: prod.id, name: prod.first_name + " " + prod.last_name, checked: checked});

            }

            for (let i = 0; i <= actorQuery.data.length - 1; i++) {
                let actor : Actor = actorQuery!.data[i];
                let queried = await getFilmActor(film!.id, actor.id);
                let checked = 0;

                if (queried !== null) checked = 1;
                else checked = 0;
                aArr.push({id: actor.id, name: actor.first_name + " " + actor.last_name, checked: checked});
            }

            // ID Extraction
            let extractId = (a : {checked : number, id: number, name: string}) => {
                if (a.checked === 1) return true;
                else return false;
            }
            let actorsId = aArr.filter(extractId).map(a => a.id)
            let producersId = pArr.filter(extractId).map(p => p.id);
            let genresString = gArr.filter(extractId).map(g => g.name.toUpperCase());

            // Setting the values
            setId(film.id);
            setName(film.name);
            setDate(new Date(film.date_released));
            setDescription(film.description);
            setDuration(film.duration!);
            setFramerate(film.frame_rate! === null ? 0 : film!.frame_rate);
            setContentRating(film.content_rating === null ? '' : film!.content_rating);

            // Setting Initial State
            setInitialState({
                'content_rating': film.content_rating, 
                'genres': genresString, 
                'actors': actorsId, 
                'producers': producersId,
                'description': film.description, 
                'name': film.name, 
                'director_fk': dFk, 
                'duration': film.duration, 
                'frame_rate': film.frame_rate, 
                'date_released': film.date_released
            });

            // Setting the arrays
            setDirectors(dArr);
            setActors(aArr);
            setProducers(pArr);
            setFilmGenres(gArr);
            setPageLoading(false);
        }

        main();
    }, [])

    async function update() {
        let finalDate = date!.toLocaleDateString('en-CA');
        let finalDirector = directorfk;
        let finalGenres = [];
        for (let i = 0; i <= filmGenres.length - 1; i++) {
            if (filmGenres[i].checked === 1) finalGenres.push(filmGenres[i].name.toUpperCase());
        }

        // ID Extraction
        let extractId = (a : {checked : number, id: number}) => {
            if (a.checked === 1) return true;
            else return false;
        }
        let actorsId = actors.filter(extractId).map(a => a.id)
        let producersId = producers.filter(extractId).map(p => p.id);
        
        setLoading(true);

        // Data validator
        // First element in array is new, second is original

        let hm = new Map();
        hm.set('description', [description, initialState.description]);
        hm.set('content_rating', [contentRating, initialState.content_rating]);
        hm.set('name', [name, initialState.name]);
        hm.set('date_released', [finalDate, initialState.date_released]);
        hm.set('duration', [duration, initialState.duration]);
        hm.set('frame_rate', [framerate, initialState.frame_rate]);
        hm.set('genres', [finalGenres, initialState.genres]);
        hm.set('director_fk', [directorfk, initialState.director_fk]);
        hm.set('actors', [actorsId, initialState.actors]);
        hm.set('producers', [producersId, initialState.producers]);

        const obj = {
            description: description,
            content_rating: contentRating,
            name: name,
            date_released: finalDate,
            duration: duration,
            frame_rate: framerate,
            genres: finalGenres,
            director_fk: finalDirector,
            actors: actorsId,
            producers: producersId,
            old_actors: hm.get('actors')[1] as Array<number>,
            old_producers: hm.get('producers')[1] as Array<number>
        }

        let compare = DataComparator(hm);
        const { updateFilm } = filmOperations(client);
        let hashmap = await updateFilm(id, obj,  compare);
        
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
                    <Box className='flex flex-col justify-center items-center mx-auto h-[15vh] md:w-[50vw] bg-black/30 p-6 rounded-lg text-white backdrop-blur-sm rounded-lg'>
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
            <Box className='flex flex-col justify-center items-center mx-auto md:w-[50vw] bg-black/30 p-6 rounded-lg text-white backdrop-blur-sm'>
                
                <Box className='flex flex-row'>
                    <Box className='mr-[2vw]'>
                        <Tooltip title='Back to Film Page'>
                            <Button variant='contained' onClick={() => router.push('/films')}>
                                <ArrowBackIcon />
                            </Button>
                        </Tooltip>
                    </Box>

                    <Typography color='white' variant='h5'> Update Film</Typography>
                </Box>

                <Box className='flex flex-row mt-[5vh]'>
                    <Box className='flex flex-col'>
                        <Typography color='white'> Name </Typography>
                        <Input placeholder='Movie Name' value={name} onChange={(event) => setName(event.target.value)} />
                    </Box>

                    <Box className='flex flex-col ml-[4vw]'>
                        <Typography color='white'> Content Rating </Typography>
                        <Input placeholder='Maturity Rating' type='text' value={contentRating} onChange={(event) => setContentRating(event.target.value)} />
                    </Box>
                </Box>

                <Box className='flex flex-row mt-[5vh]'>

                    <Box className='flex flex-col'>
                        <Typography color='white'> Duration </Typography>
                        <Input type='number' placeholder='In Minutes' value={duration} onChange={(event) => setDuration(Number(event.target.value))} />
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
                        <Input placeholder='Frames per Second' type='number' value={framerate} onChange={(event) => setFramerate(Number(event.target.value))} />
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
                                        Genres
                                    </Typography>
                                    <Typography sx={{ mt: 2 }}>
                                        You can choose multiple genres
                                    </Typography>
                                    <Box>
                                    <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                                        <FormGroup>
                                        {filmGenres.map((genre, idx) => (
                                                <FormControlLabel
                                                control={
                                                <Checkbox 
                                                sx = {{ backgroundColor: 'antiquewhite', 
                                                    borderRadius: 1, width: 14, 
                                                    height: 14, border: 'none' }} 
                                                checked={genre.checked === 0 ? false : true} 
                                                onChange={() => handleGenreChange(genre.id)} name={genre.name} />
                                                }
                                                sx = {{ gap: 2, marginTop: 2 }}
                                                label={genre.name.charAt(0).toUpperCase() + genre.name.substring(1).toLowerCase()}
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
                                <Typography color='white'> Directors </Typography>
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
                                                <Checkbox 
                                                sx = {{ backgroundColor: 'antiquewhite', 
                                                    borderRadius: 1, width: 14, 
                                                    height: 14, border: 'none' }} 
                                                color='success' checked={director.checked === 0 ? false : true} 
                                                onChange={() => handleChange(director.id, 'director')} 
                                                name={director.name} />
                                                }
                                                label={director.name}
                                                sx = {{ gap: 2, marginTop: 2 }}
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
                                <Typography color='white'> Producers </Typography>
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
                                                <Checkbox 
                                                    sx = {{ backgroundColor: 'antiquewhite', 
                                                    borderRadius: 1, width: 14, 
                                                    height: 14, border: 'none' }} 
                                                    checked={producer.checked === 1 ? true : false} 
                                                    onChange={() => handleChange(producer.id, 'producer')} 
                                                    name={producer.name} />
                                                }
                                                label={producer.name}
                                                sx = {{ gap: 2, marginTop: 2 }}
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
                                <Typography color='white'> Actors </Typography>
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
                                                <Checkbox 
                                                    sx = {{ backgroundColor: 'antiquewhite', 
                                                    borderRadius: 1, width: 14, 
                                                    height: 14, border: 'none' }} 
                                                checked={actor.checked === 0 ? false : true} 
                                                onChange={() => handleChange(actor.id, 'actor')} 
                                                name={actor.name} />
                                                }
                                                label={actor.name}
                                                sx = {{ gap: 2, marginTop: 2 }}

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
                    onClick={update}
                    >
                        {loading ? null : 'Update'}
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