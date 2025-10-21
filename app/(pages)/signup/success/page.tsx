'use client'
import { client } from "@/app/Backend/createclient";
import operations from "@/app/Backend/users/operations";
import Header from "@/app/Components/Header";
import { Box, Button } from "@mui/joy";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function Success () {
    return(
        <>
            <Header currentUser={ undefined } />
            <Box className='flex h-screen items-center justify-center'>
                <Box className='flex flex-col justify-center items-center mx-auto h-[15vh] md:w-[50vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                    You've successfully created your account! You are now logged in to the site.
                    <Box className='mt-[2vh]'>
                        <Link href='/films'>
                            <Button variant='soft'>
                                Back to Films
                            </Button>
                        </Link>
                    </Box>
                </Box>
            </Box>
        </>
    )
}
