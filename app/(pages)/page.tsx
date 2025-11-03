'use client'
import { Box, Button } from "@mui/joy";
import Typography from "@mui/material/Typography";
import Image from "next/image";
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
          Film is man's interpretation of the world which reflects mankind's inward desires and conflicting nature.
          One of the beautiful capabilities of film is to unite the differing compasses each of us hold when navigating life's congenial journeys. 
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

    <Box className='flex mt-[8vh] mr-auto ml-auto'>
        <Box className='flex flex-row gap-7 md:ml-[5vw] md-ml-auto md:w-[30vw] bg-black/30 p-6 rounded-lg text-white backdrop-blur-sm'>
          <Box className='flex flex-col gap-2'>
            <Box>
              <Typography variant='h5'>Ingmar Bergman</Typography>
            </Box>
            <Box> 
              <Image className='rounded-lg' src='/ingar.jpeg' alt={""} width='345' height='460'  />
            </Box>
          </Box>
          <Box>
            <Typography variant='body1'> 
            <i>“No art passes our conscience in the way film does, 
              and goes directly to our feelings, deep down into the dark rooms of the soul.”</i>
            </Typography>
          </Box>
        </Box>
      </Box>

    </>
  );
}
