'use client'
import Header from "@/app/Components/Header";
import { Box, Button } from "@mui/joy";
import Link from "next/link";


export default function Success () {
    return(
        <>
            <Header currentUser={ undefined } />
            <Box className='flex h-screen items-center justify-center'>
                <Box className='flex flex-col justify-center items-center mx-auto h-[15vh] md:w-[50vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                    You've successfully created your account! You are now automatically logged in to the site.
                    <Link href='/films'>
                        <Button variant='soft'>
                            Back to Films
                        </Button>
                    </Link>
                </Box>
            </Box>
        </>
    )
}