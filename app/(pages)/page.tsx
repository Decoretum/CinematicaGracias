'use client'
import { Box, Button } from "@mui/joy";
import Typography from "@mui/material/Typography";
import Link from "next/link";

export default function Home() {

  return (
    <>
    <Box className='md:flex flex-col'>
      <Box className='flex flex-col md:mt-[2vh] md:ml-[3vw] text-black'>
        <Typography variant='h2'> Cinematica Gracias </Typography>
        <Typography variant='h4'> A Living Collection of Films Worldwide </Typography>
      </Box>

      <Box className='md:ml-[5vw] md:mt-[3vh] md:w-[30vw] bg-black/30 p-6 rounded-lg text-white backdrop-blur-sm'>
        <Typography variant='body1'> 
          As of 2075, there have been more than 2 million films released worldwide. 
          Print media is extinct, and 79% of transcations, entertainment, and media are performed digitally.
          Cinematica Gracias's mission is to preserve and nurture the timeless masterpiece made by human creativity
          and ingenuinity for eternity.
        </Typography>
      </Box>

      <Box className='flex justify-end mr-[2vw]'>
        <Box className='md:ml-[5vw] md-ml-auto md:w-[30vw] bg-black/30 p-6 rounded-lg text-white backdrop-blur-sm'>
          <Typography variant='body1'> 
            Classic and modern films are preserved for continuous learning and in order to champion humanity's love and passion for the arts and sciences.
          </Typography>
        </Box>
      </Box>

    </Box>

    <Box className='mt-[3vh] flex w-screen items-center justify-center'>
      <Link href='/films'>
        <Button variant='soft' color='neutral'> Explore </Button>
      </Link>
    </Box>
    </>
  );
}
