'use client'
import { Box } from "@mui/joy";
import { Button, Snackbar } from '@mui/material'
import Typography from "@mui/material/Typography";
import Header from "../../Components/Header";
import Input from '@mui/joy/Input';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Tooltip from '@mui/material/Tooltip';
import { useState } from "react";
import { useRouter } from 'next/navigation'
import { CircularProgress } from "@mui/material";
import Login from "@/app/Backend/users/login";
import "react-datepicker/dist/react-datepicker.css";



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
        if (response.error !== null) {
            setMessage("Invalid Login");
            setAlert(true);
            setLoading(false);
            return;
        }
        
        else {
            router.push('/films');
            return;
        }
    }

    return(
        <>
            <Header currentUser={ null } loading={false} />
            <Box className='flex flex-col justify-center items-center mx-auto md:w-[30vw] md:h-[80vh] bg-black/30 p-6 rounded-lg text-white backdrop-blur-sm'>
                
                <Box className='flex flex-row'>
                    <Box className='mr-[2vw]'>
                        <Tooltip title='Back to Signup'>
                            <Button variant='contained' onClick={() => router.push('/signup')}>
                                <ArrowBackIcon />
                            </Button>
                        </Tooltip>
                    </Box>

                    <Typography color='white' variant='h5'> Login </Typography>
                </Box>

                <Box className='flex flex-col mt-[4vh]'>

                    <Box className='flex flex-col'>
                        <Typography color='white'> Email </Typography>
                        <Input placeholder='ex. local_name@domain.com' onChange={(event) => setUserName(event.target.value)} />
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

                <Box className='flex flex-row items-center mt-[8vh] justify-between max-w-[25vw] w-[25vw]'>
                    <Box>
                        <Typography variant='body2'>
                            No Account yet?
                        </Typography>
                    </Box>

                    <Box>
                        <Button variant='text' color='success' onClick= {() => router.push('/signup')}>
                            Create an Account
                        </Button>
                    </Box>
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