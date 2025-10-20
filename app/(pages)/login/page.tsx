'use client'
import { Box, FormControl, RadioGroup } from "@mui/joy";
import { Button, Snackbar } from '@mui/material'
import Typography from "@mui/material/Typography";
import Header from "../../Components/Header";
import Input from '@mui/joy/Input';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Tooltip from '@mui/material/Tooltip';
import Switch from '@mui/joy/Switch';
import Radio from '@mui/joy/Radio';
import DatePicker from "react-datepicker";
import { useState } from "react";
import signup from '../../Backend/users/signup'
import Alert from '@mui/material/Alert';
import { useRouter } from 'next/navigation'
import { CircularProgress } from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import Login from "@/app/Backend/users/login";
import { LoginUser } from "@/app/Types/users/usertypes";
import { AuthError } from "@supabase/supabase-js";


export default function SignUp () {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function login() {
        setLoading(true);
        let response = await Login(userName, password);
        if (response !== null) {
            setMessage("Invalid Login");
            setAlert(true);
            setLoading(false);
            return;
        }
        
        else {
            router.push('/signup/success');
            return;
        }
    }

    return(
        <>
            <Header currentUser={ null } />
            <Box className='flex flex-col justify-center items-center mx-auto md:w-[30vw] md:h-[80vh] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                
                <Box className='flex flex-row'>
                    <Box className='mr-[2vw]'>
                        <Tooltip title='Back to Home'>
                            <Button variant='contained' onClick={() => router.push('/')}>
                                <ArrowBackIcon />
                            </Button>
                        </Tooltip>
                    </Box>

                    <Typography color='white' variant='h5'> Login </Typography>
                </Box>

                <Box className='flex flex-col mt-[4vh]'>

                    <Box className='flex flex-col'>
                        <Typography color='white'> Username </Typography>
                        <Input placeholder='Username' onChange={(event) => setUserName(event.target.value)} />
                    </Box>

                    <Box className='flex flex-col mt-[5vh]'>
                        <Typography color='white'> Password </Typography>
                        <Input placeholder='Password' type='password' onChange={(event) => setPassword(event.target.value)} />
                    </Box>
                </Box>


                <Box className='mt-[6vh]'>
                    <Button 
                    variant='contained'
                    disabled = {loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                    onClick={login}
                    >
                        {loading ? null : 'Login'}
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