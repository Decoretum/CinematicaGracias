'use client'
import { Box, Button, FormControl, RadioGroup } from "@mui/joy";
import Typography from "@mui/material/Typography";
import Header from "../Components/Header";
import Input from '@mui/joy/Input';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Tooltip from '@mui/material/Tooltip';
import Switch from '@mui/joy/Switch';
import Radio from '@mui/joy/Radio';
import DatePicker from "react-datepicker";
import { useState } from "react";
import signup from '../Backend/users/signup'
import Alert from '@mui/material/Alert';
import { useRouter } from 'next/navigation'


import "react-datepicker/dist/react-datepicker.css";
import Stack from "@mui/material/Stack";

export default function SignUp () {
    const [check, setCheck] = useState(false);
    const [date, setDate] = useState<Date | null>(new Date());
    const [sex, setSex] = useState('m');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [alert, setAlert] = useState(true);
    const [message, setMessage] = useState('');
    const router = useRouter();

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSex(event.target.value);
    }

    async function createUser() {
        let finalDate = date!.toLocaleDateString('en-CA');
            const obj = {
            first_name : firstName,
            last_name : lastName,
            email : email,
            username : userName,
            password : password,
            sex : sex,
            birthday : finalDate as string,
            is_admin : check ? true : false
        }

        let hashmap = await signup(obj);
        console.log(hashmap);
        if (hashmap.result !== 'success') {
            setMessage(hashmap.result);
            setAlert(false);
        }
        
        else {
            let activeSession = hashmap.metadata.data.session.access_token != null || hashmap.metadata.data.session.access_token != undefined;
            if (activeSession) {
                router.push('/signup/success');
                return;
            }
        }
    }

    return(
        <>
            <Header currentUser={ undefined } />
            <Box className='flex flex-col justify-center items-center mx-auto md:w-[50vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                
                <Box className='flex flex-row'>
                    <Box className='mr-[2vw]'>
                        <Tooltip title='Back to Film Pages'>
                            <Button variant='soft'>
                                <ArrowBackIcon />
                            </Button>
                        </Tooltip>
                    </Box>

                    <Typography color='white' variant='h5'> Create your Account </Typography>
                </Box>

                <Box className='flex flex-row mt-[4vh]'>

                    <Box className='flex flex-col'>
                        <Typography color='white'> Username </Typography>
                        <Input placeholder='Username' onChange={(event) => setUserName(event.target.value)} />
                    </Box>

                    <Box className='flex flex-col ml-[4vw]'>
                        <Typography color='white'> Password </Typography>
                        <Input placeholder='Password' type='password' onChange={(event) => setPassword(event.target.value)} />
                    </Box>
                </Box>

                <Box className='flex flex-row mt-[5vh]'>
                    <Box className='flex flex-col'>
                        <Typography color='white'> First Name </Typography>
                        <Input placeholder='Given Name' onChange={(event) => setFirstName(event.target.value)} />
                    </Box>

                    <Box className='flex flex-col ml-[4vw]'>
                        <Typography color='white'> Last Name </Typography>
                        <Input placeholder='Surname' onChange={(event) => setLastName(event.target.value)} />
                    </Box>
                </Box>

                <Box className='flex flex-row mt-[5vh]'>
                    <Box className='flex flex-col'>
                        <Box>
                            <Typography color='white'> Email </Typography>
                            <Input placeholder='Email' onChange={(event) => setEmail(event.target.value)} />
                        </Box>
                    </Box>

                    <Box className='flex flex-col ml-[4vw]'>
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
                        <Typography color='white'> Sex </Typography>
                        <FormControl>
                            <RadioGroup onChange={handleChange} defaultValue="m" name="radio-buttons-group">
                                <Radio slotProps={{ label: { sx: { color: 'white' } } }} value="m" className='color-white' label="Male" variant="outlined" />
                                <Radio slotProps={{ label: { sx: { color: 'white' } } }} value="f" label="Female" variant="outlined" />
                            </RadioGroup>
                        </FormControl>
                    </Box>

                    <Box> 
                        <Typography color='white'> Are you Creating an Admin Account? </Typography>
                            <Box className='flex mt-4 justify-center'>
                                <Switch className='mt-8' checked={check} onChange={(event) => setCheck(event.target.checked)} />
                            </Box>
                    </Box>
                </Box>

                <Box className='mt-[2vh]'>
                    <Button variant='soft' onClick={createUser}>Submit</Button>
                </Box>                    
            </Box>
            <Stack sx={{ width: '100%', marginTop: '1vh' }}>
                <Alert hidden={alert} onClick={() => setAlert(true)} severity="error" onClose={() => {setAlert(true)}}>{message}</Alert>
            </Stack>
            
        </>
    )
}