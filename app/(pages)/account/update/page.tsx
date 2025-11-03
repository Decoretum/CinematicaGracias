'use client'
import { Box, FormControl, RadioGroup } from "@mui/joy";
import { Button, Snackbar } from '@mui/material'
import Typography from "@mui/material/Typography";
import Header from "../../../Components/Header";
import Input from '@mui/joy/Input';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Tooltip from '@mui/material/Tooltip';
import Radio from '@mui/joy/Radio';
import DatePicker from "react-datepicker";
import signup from '../../../Backend/users/signup'
import userOperation from '../../../Backend/users/operations'
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { CircularProgress } from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import { client } from "@/app/Backend/createclient";
import { Users } from "@/app/Types/entitytypes";
import { EditUser } from "@/app/Types/users/usertypes";
import DataComparator from "@/app/Helpers/DataComparator";

export default function SignUp () {
    const [id, setId] = useState<string>('');
    const [date, setDate] = useState<Date | null>(null);
    const [sex, setSex] = useState('m');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [alert, setAlert] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [initialState, setInitialState] = useState<EditUser>({id: '', email: '', password: '', birthday: '', username: '', first_name: '', last_name: '', sex: ''});
    const router = useRouter();

    useEffect(() => {
        const main = async () => {

        // Get Non Auth and Auth User
        let { getCurrentUser } = await userOperation(client);
        let { user, nonAuthUser } = await getCurrentUser();
        let users : Users = nonAuthUser![0];

        // Setting Initial State

        setInitialState({
            id: users.id,
            username: users.username,
            birthday: users.birthday,
            email: user!.email!,
            password: '',
            first_name: users.first_name,
            last_name: users.last_name,
            sex: users.sex
        })

        // Setting the dynamic variables
        
        setId(users.id);
        setUserName(users.username);
        setDate(new Date(users.birthday));
        setFirstName(users.first_name);
        setLastName(users.last_name);
        setSex(users.sex);
        setEmail(user!.email!);

        console.log(user)
        console.log(nonAuthUser)
        console.log(users)
        setPageLoading(false);
        }
        main();
    }, [])
    
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSex(event.target.value);
    }

    async function updateUser() {
        let { updateUser } = await userOperation(client);
        let finalDate : string = date!.toLocaleDateString('en-CA');
        const obj = {
            id: id,
            first_name : firstName,
            last_name : lastName,
            email : email,
            username : userName,
            password : password,
            sex : sex,
            birthday : finalDate,
        }

        // Data Comparator Result
        // First element in array is new, second is original

        console.log(initialState)
        let hm = new Map();
        hm.set('first_name', [firstName, initialState.first_name]);
        hm.set('last_name', [lastName, initialState.last_name]);
        hm.set('username', [userName, initialState.username]);
        hm.set('email', [email, initialState.email]);
        hm.set('password', [password, initialState.password]);
        hm.set('sex', [sex, initialState.sex]);
        hm.set('birthday', [finalDate, initialState.birthday]);

        setLoading(true);
        let compare = DataComparator(hm);
        let hashmap = await updateUser(id!, obj, compare);
        console.log(hashmap)
        if (hashmap.result !== 'success') {
            setMessage(hashmap.result);
            setAlert(true);
            setLoading(false);
            return;
        }
        
        else {
            router.push('/account/info');
            return;
        }
    }

    if (pageLoading) {
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


    return(
        <>
            <Header currentUser={ null } />
            <Box className='flex flex-col justify-center items-center mx-auto md:w-[50vw] bg-black/30 p-6 rounded-lg text-white backdrop-blur-sm'>
                
                <Box className='flex flex-row'>
                    <Box className='mr-[2vw]'>
                        <Tooltip title='Back to Account Info'>
                            <Button variant='contained' onClick={() => router.push('/account/info')}>
                                <ArrowBackIcon />
                            </Button>
                        </Tooltip>
                    </Box>

                    <Typography color='white' variant='h5'> Update Account Info </Typography>
                </Box>

                <Box className='flex flex-row mt-[4vh]'>

                    <Box className='flex flex-col'>
                        <Typography color='white'> Username </Typography>
                        <Input placeholder='Username' value={userName} onChange={(event) => setUserName(event.target.value)} />
                    </Box>

                    <Box className='flex flex-col ml-[4vw]'>
                        <Typography color='white'> Password </Typography>
                        <Input placeholder='New Password' value={password} type='password' onChange={(event) => setPassword(event.target.value)} />
                    </Box>
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
                    <Box className='flex flex-col'>
                        <Box>
                            <Typography color='white'> Email </Typography>
                            <Input placeholder='Email' value={email} onChange={(event) => setEmail(event.target.value)} />
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
                        <Typography color='white'>Sex at Birth</Typography>
                        <FormControl>
                            <RadioGroup onChange={handleChange} value={sex} name="radio-buttons-group">
                                <Radio slotProps={{ label: { sx: { color: 'white' } } }} value="m" className='color-white' label="Male" variant="outlined" />
                                <Radio slotProps={{ label: { sx: { color: 'white' } } }} value="f" label="Female" variant="outlined" />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                </Box>

                <Box className='flex mt-[4vh] justify-between w-[40vw] max-w-[40vw]'>
                    <Box className='ml-auto max-w-[5vw] w-[5vw]'>
                        <Button 
                        variant='contained'
                        disabled = {loading}
                        startIcon={loading ? <CircularProgress size={20} /> : null}
                        onClick={updateUser}
                        >
                            {loading ? null : 'Update'}
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