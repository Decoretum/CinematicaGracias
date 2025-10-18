import { Box, Button } from "@mui/joy";
import Dropdown from "./Dropdown";
import Link from "next/link";
import { Users } from "../Types/entitytypes";

type userData = {
    currentUser : Users | null | undefined
}

export default function Header(props : userData) {
    return(
        <Box className='flex justify-between w-full'>
            <Box className='relative mt-[2vh] ml-[2vw]'>
                    <Dropdown />
            </Box>
            <Box className='relative mt-[2vh] mr-[2vw]'>
                {
                props.currentUser === null && props.currentUser !== undefined ? (
                    <Box>
                        <Link href='/signup'>
                            <Button variant='soft' color='primary'>
                                Sign In
                            </Button>
                        </Link>
                    </Box>
                ) : 
                (
                <>

                </>
                )
                }
            </Box>
        </Box>
    )
}