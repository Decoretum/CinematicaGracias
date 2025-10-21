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
import operations from '../../../../Backend/producers/operations'
import "react-datepicker/dist/react-datepicker.css";
import { client } from "@/app/Backend/createclient";
import CircularProgress from "@mui/material/CircularProgress";
import { ProducerCreate } from "@/app/Types/producers/producertypes";
import DataComparator from "@/app/Helpers/DataComparator";

export default function UpdateProducer ({ params } : { params: Promise<{ n: number }> }) {
    const [description, setDescription] = useState('');
    const [date, setDate] = useState<Date | null>(new Date());
    const [sex, setSex] = useState('m');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [alert, setAlert] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [initialState, setInitialState] = useState<ProducerCreate>({'birthday': '', 'description': '', 'first_name': '', 'last_name': '', 'sex': ''});
    const [id, setId] = useState<number>(0);
    const router = useRouter();
    const { updateProducer, getProducer } = operations(client);
    

    useEffect(() => {
        const main = async () => {
            const { n } = await params;
            let producer = await getProducer(n);
            setFirstName(producer!.first_name);
            setLastName(producer!.last_name);
            setSex(producer!.sex);
            setDescription(producer!.description);
            setDate(new Date(producer!.birthday));   
            setId(n);
            
            setInitialState({
                first_name: producer!.first_name,
                last_name: producer!.last_name,
                sex: producer!.sex,
                birthday: producer!.birthday,
                description: producer!.description
            })
    
            console.log(producer);
            setPageLoading(false);
        }
        main();
    }, [])

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSex(event.target.value);
    }

    async function update () {
        let finalDate = date!.toLocaleDateString('en-CA');

        const obj = {
            first_name : firstName,
            last_name : lastName,
            sex : sex,
            birthday : finalDate as string,
            description: description
        }
        console.log(obj)

        // Data Comparator Result
        // First element in array is new, second is original
        setLoading(true);
        let hm = new Map();
        hm.set('first_name', [firstName, initialState.first_name]);
        hm.set('last_name', [lastName, initialState.last_name]);
        hm.set('birthday', [finalDate, initialState.birthday]);
        hm.set('description', [description, initialState.description]);
        hm.set('sex', [sex, initialState.sex]);

        let compare = DataComparator(hm);
        let hashmap = await updateProducer(id, obj, compare);
        console.log(hashmap);
        if (hashmap.result !== 'success') {
            setMessage(hashmap.result);
            setAlert(true);
            setLoading(false);
        }
        
        else {
            router.push('/producers');
            setLoading(false);
            return;   
        }
    }

    if (pageLoading === true) {
        return(
            <>
                <Header currentUser={ undefined } />
                <Box className='flex h-screen items-center justify-center'>
                    <Box className='flex flex-col justify-center items-center mx-auto h-[15vh] md:w-[50vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                        Loading Producer Data
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
                        <Tooltip title='Back to Director Pages'>
                            <Button variant='contained'>
                                <ArrowBackIcon />
                            </Button>
                        </Tooltip>
                    </Box>

                    <Typography color='white' variant='h5'> Edit Director </Typography>
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
                            <RadioGroup onChange={handleChange} value={sex} name="radio-buttons-group">
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

                <Box className='flex flex-row mt-[6vh] gap-20'>
                    <Box>
                        <Typography color='white'> Description / Biography </Typography>
                        <Textarea
                        value={description}
                        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value)}
                        placeholder="Write a description for the Director"
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
            />
        </>
    )
}