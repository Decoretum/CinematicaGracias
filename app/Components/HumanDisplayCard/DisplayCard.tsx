import { DirectorDisplay } from "@/app/Types/directors/directortypes";
import { Card, CardContent, Typography } from "@mui/material";
import React from "react";

export default function DisplayCard(props : DirectorDisplay) {
    return(
        <Card variant='elevation' className='max-h-[23vh] max-w-[15vw]'>
            <React.Fragment>
                <CardContent>
                    <Typography sx= {{ fontSize: 20 }}> {props.first_name} {props.last_name} </Typography>
                    <Typography> Birthed at {props.birthday} </Typography>
                </CardContent>
            </React.Fragment>

        </Card>
    )
}