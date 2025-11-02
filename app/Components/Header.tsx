import { Box, Button } from "@mui/joy";
import DropdownComponent from "./Dropdown";
import Link from "next/link";
import { Users } from "../Types/entitytypes";
import { Typography } from "@mui/material";
import { useRouter } from 'next/navigation';
import SignOut from '../Backend/users/logout';
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';


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
                    <DropdownComponent />
            </Box>

            <Box className='relative mt-[2vh] mr-[2vw]'>
                {
                props.currentUser === undefined ? (
                    <>
                    </>
                ) :
                props.currentUser !== null ? (
                    <Box className='flex flex-row gap-5'>
                        <Box className='mt-[1vh] flex flex-row items-center gap-3'> 
                                <Box>
                                <Typography>Hi,</Typography> 
                                </Box>

                                <Box>
                                    <Dropdown>
                                        <MenuButton variant='solid' color='success'>{props.currentUser?.username}</MenuButton>
                                        <Menu>
                                            <MenuItem onClick={() => navigate.push('/account/info')}> Account Info </MenuItem>
                                            <MenuItem onClick={handleSignOut}> Sign Out </MenuItem>
                                        </Menu>
                                    </Dropdown>
                                </Box>
                        </Box> 
                        
                    </Box>
                ) 
               : (
                    <Box>
                        <Link href='/login'>
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