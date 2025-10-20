import { FilmDisplay } from "@/app/Types/films/filmtypes";
import { Box, Card, CardContent, Typography } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import React from "react";

export default function DisplayCard(props : FilmDisplay) {
    return(
        <Card variant='elevation'>
            <React.Fragment>
                <CardContent>
                    <Box className='relative'>
                        <InfoIcon className='absolute right-0 top-0' />
                        <Typography sx= {{ fontSize: 20 , maxWidth: '25vw'}}> {props.name} </Typography>
                        <Typography variant='caption'> Released: {props.date_released} </Typography>
                    </Box>
                    <Box className='flex flex-row mt-[2vh] gap-10'>
                        <Typography sx={{ color: 'text.secondary' }}> {props.average_user_rating} ✬ </Typography>
                        <Typography variant='button'> {props.content_rating} </Typography>
                        <Typography> {props.duration} mins </Typography>
                    </Box>

                </CardContent>
            </React.Fragment>

        </Card>
    )
}