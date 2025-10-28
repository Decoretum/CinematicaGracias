import { DirectorDisplay } from "@/app/Types/directors/directortypes";
import { Box, Card, CardContent, Typography } from "@mui/material";
import React from "react";

export default function DisplayCard(props : DirectorDisplay) {
    return(
        <Card variant='elevation' className='max-h-[23vh] h-[23vh] max-w-[15vw]'>
            <React.Fragment>
                <CardContent>
                    <Box className='flex flex-col justify-between max-h-[20vh] h-[20vh]'>
                        <Box>
                            <Typography sx= {{ fontSize: 20 }}> {props.first_name} {props.last_name} </Typography>
                        </Box>

                        <Box>
                            <Typography> Birthed at {props.birthday} </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </React.Fragment>

        </Card>
    )
}