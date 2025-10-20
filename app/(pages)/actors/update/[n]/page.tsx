'use client'
import { Box, FormControl, RadioGroup, Textarea } from "@mui/joy";
import { Button } from '@mui/material'
import Typography from "@mui/material/Typography";
import Header from '../../../../Components/Header'
import Input from '@mui/joy/Input';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Tooltip from '@mui/material/Tooltip';
import Radio from '@mui/joy/Radio';
import DatePicker from "react-datepicker";
import { ChangeEvent, useEffect, useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import { useRouter } from 'next/navigation'
import operations from '../../../../Backend/actors/operations'
import "react-datepicker/dist/react-datepicker.css";
import { client } from "@/app/Backend/createclient";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { ActorUpdate } from "@/app/Types/actors/actortypes";
import DataComparator from "@/app/Helpers/DataComparator";

export default function UpdateActor ({ params } : { params: Promise<{ n: number }> }) {
    const [description, setDescription] = useState('');
    const [date, setDate] = useState<Date | null>(new Date());
    const [sex, setSex] = useState('m');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [alert, setAlert] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [socmed, setSocMed] = useState<{media: string, link: string}[]>([{media: '', link: ''}]);
    const [pageLoading, setPageLoading] = useState(true);
    const [id, setId] = useState<number>(0);
    const [initialState, setInitialState] = useState<ActorUpdate>({'birthday': '', 'description': '', 'first_name': '', 'last_name': '', 'sex': '', 'socmed': [{media: '', link: ''}]});
    const router = useRouter();
    const { updateActor, getActor } = operations(client);

    useEffect(() => {
        const main = async () => {
            const { n } = await params;
            let actor = await getActor(n);
            setFirstName(actor!.first_name);
            setLastName(actor!.last_name);
            setSex(actor!.sex);
            setDescription(actor!.description);
            setDate(new Date(actor!.birthday));   
            setId(n);

            // Unflatterning Social Media array
            let arr : Array<{media: string, link: string}> = [{media: '', link: ''}];
            if (actor!.socmed !== null) {
                arr.pop();
                for (let i = 0; i <= actor!.socmed.length - 1; i++) {
                    console.log(actor!.socmed[i]);
                    let miniArr = actor?.socmed[i].split('||');
                    arr!.push({media: miniArr![0], link: miniArr![1]});
                }
                arr.push({media: '', link: ''});
            } 
            // console.log(arr)
            setSocMed(arr);
            
            setInitialState({
                first_name: actor!.first_name,
                last_name: actor!.last_name,
                sex: actor!.sex,
                birthday: actor!.birthday,
                description: actor!.description,
                socmed: arr
            })
            
    
            console.log(actor);
            console.log(socmed)
            setPageLoading(false);
        }
        main();
    }, [])


    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSex(event.target.value);
    }

    function addRow() {
        setSocMed([...socmed, {media: '', link: ''}])
    }

    function removeRow(index : number) {
        let arr = [];
        for (let i = 0; i <= socmed.length - 1; i++) {
            if (i !== index) arr.push(socmed[i]);
        }
        setSocMed(arr);
    }

    function changeArray(index : number, field: 'media' | 'link', value : string) {
        let unMutated = [...socmed];
        unMutated[index][field] = value;
        setSocMed(unMutated);
        console.log(socmed);
    }

    async function update() {
        let finalDate = date!.toLocaleDateString('en-CA');
        
        // Concatenate socmed array
        let arr = [];
        for (let i = 0; i <= socmed.length - 1; i++) {
            let notEmpty = socmed[i].media.replace(/\s+/g, '') !== '' && socmed[i].link.replace(/\s+/g, '') !== '';
            if (notEmpty)arr.push(socmed[i].media + "||" + socmed[i].link)
        }


        const obj = {
            first_name : firstName,
            last_name : lastName,
            sex : sex,
            birthday : finalDate as string,
            description: description,
            socmed: arr
        }

        // Data Comparator Result
        // First element in array is new, second is original
        setLoading(true);
        let hm = new Map();
        hm.set('first_name', [firstName, initialState.first_name]);
        hm.set('last_name', [lastName, initialState.last_name]);
        hm.set('birthday', [finalDate, initialState.birthday]);
        hm.set('description', [description, initialState.description]);
        hm.set('sex', [sex, initialState.sex]);
        hm.set('socmed', [arr, initialState.socmed]);

        let compare = DataComparator(hm);
        let hashmap = await updateActor(id, obj, compare);

        setLoading(true);
        console.log(hashmap);
        if (hashmap.result !== 'success') {
            setMessage(hashmap.result);
            setAlert(true);
            setLoading(false);
        }
        
        else {
            router.push('/actors');
            return;   
        }
    }

    if (pageLoading === true) {
        return(
            <>
                <Header currentUser={ undefined } />
                <Box className='flex h-screen items-center justify-center'>
                    <Box className='flex flex-col justify-center items-center mx-auto h-[15vh] md:w-[50vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm rounded-lg'>
                        Loading Actor Data
                        <CircularProgress className='mt-4' color='secondary' /> 
                    </Box>
                </Box>

            </>
        )
    }

    return (
        <>
            <Header currentUser={ undefined } />
            <Box className='flex flex-col justify-center items-center mx-auto md:w-[50vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                
                <Box className='flex flex-row'>
                    <Box className='mr-[2vw]'>
                        <Tooltip title='Back to Actor Page'>
                            <Button variant='contained'>
                                <ArrowBackIcon />
                            </Button>
                        </Tooltip>
                    </Box>

                    <Typography color='white' variant='h5'> Update Actor </Typography>
                </Box>

                <Box className='flex flex-row mt-[5vh]'>
                    <Box className='flex flex-col'>
                        <Typography color='white'> First Name </Typography>
                        <Input placeholder='Given Name' value={firstName} onChange={(event) => setFirstName(event.target.value)} />
                    </Box>

                    <Box className='flex flex-col ml-[4vw]'>
                        <Typography color='white'> Last Name </Typography>
                        <Input placeholder='Surname' value={lastName} onChange={(event) => setLastName(event.target.value)} />
                    </Box>
                </Box>

                <Box className='flex flex-row mt-[5vh]'>
                    <Box>
                        <Typography color='white'> Sex at Birth </Typography>
                        <FormControl>
                            <RadioGroup onChange={handleChange} defaultValue={sex} name="radio-buttons-group">
                                <Radio slotProps={{ label: { sx: { color: 'white' } } }} value="m" className='color-white' label="Male" variant="outlined" />
                                <Radio slotProps={{ label: { sx: { color: 'white' } } }} value="f" label="Female" variant="outlined" />
                            </RadioGroup>
                        </FormControl>
                    </Box>

                    <Box className='flex flex-col ml-[12vw]'>
                        <Typography color='white'> Birthday </Typography>
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

                <Box className='flex flex-col ml-[4vw] mt-[6vh] gap-13'>
                    <Box>
                        <Box className='flex flex-row gap-50'>
                            <Typography variant='body1'>Media</Typography>
                            <Typography variant='body1'>Link</Typography>
                        </Box>

                        {socmed.map((row, index) => (
                            <Box className='flex flex-row mt-[2vh]'>
                                <Input className='w-[10vw]' variant='soft' value={row.media} onChange={(event) => changeArray(index, 'media', event.target.value)} />
                                <Input className='ml-[3vw]' variant='soft' value={row.link} onChange={(event) => changeArray(index, 'link', event.target.value)} />
                                <Button onClick={() => removeRow(index)} color='warning' className='ml-[2vw]' sx={{width: '2vw'}} variant='text'><DeleteIcon /></Button>
                                { index === socmed.length - 1 && <Button onClick={addRow} color='info'  sx={{width: '2vw'}} variant='text'><AddIcon /></Button> }
                                
                            </Box>
                        ))}

                    </Box>

                    <Box className='ml-[2vw]'>
                        <Typography color='white'> Description / Biography </Typography>
                        <Textarea
                        value={description}
                        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value)}
                        placeholder="Write a description for the Actor"
                        className='mt-[2vh] w-[33vw]'
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
            // action={action}
            />
        </>
    )
}