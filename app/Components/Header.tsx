import { Box, Button } from "@mui/joy";
import Dropdown from "./Dropdown";
import Link from "next/link";
import { Users } from "../Types/entitytypes";
import { Typography } from "@mui/material";
import { useRouter } from 'next/navigation';
import SignOut from '../Backend/users/logout';

type userData = {
    currentUser : Users | null | undefined
}

export default function Header(props : userData) {
    let navigate = useRouter();

    function handleSignOut() {
        SignOut();
        navigate.push('/');
        
    }

    return(
        <Box className='flex justify-between w-full'>
            <Box className='relative mt-[2vh] ml-[2vw]'>
                    <Dropdown />
            </Box>
            <Box className='relative mt-[2vh] mr-[2vw]'>
                {
                props.currentUser === undefined ? (
                    <>
                    </>
                ) :
                props.currentUser !== null ? (
                    <Box className='flex flex-row gap-5'>
                        <Box className='mt-[1vh]'>
                            <Typography> 
                                Hi, {props.currentUser?.username}
                            </Typography>
                        </Box> 
                        
                        <Box>
                            <Button variant='soft' color='warning' onClick={handleSignOut}>
                                Sign out
                            </Button>
                        </Box>
                    </Box>
                ) 
               : (
                    <Box>
                        <Link href='/signup'>
                            <Button variant='soft' color='primary'>
                                Sign In
                            </Button>
                        </Link>
                    </Box>
                )
                }
            </Box>
        </Box>
    )
}