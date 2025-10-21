'use client'
import { Box, FormControl, RadioGroup, Textarea } from "@mui/joy";
import { Button } from '@mui/material'
import Typography from "@mui/material/Typography";
import Header from '../../../Components/Header'
import Input from '@mui/joy/Input';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Tooltip from '@mui/material/Tooltip';
import Radio from '@mui/joy/Radio';
import DatePicker from "react-datepicker";
import { ChangeEvent, useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import { useRouter } from 'next/navigation'
import operations from '../../../Backend/actors/operations'
import "react-datepicker/dist/react-datepicker.css";
import { client } from "@/app/Backend/createclient";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function CreateActor () {
    const [description, setDescription] = useState('');
    const [date, setDate] = useState<Date | null>(new Date());
    const [sex, setSex] = useState('m');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [alert, setAlert] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [socmed, setSocMed] = useState([{media: '', link: ''}]);
    const router = useRouter();

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSex(event.target.value);
    }

    function addRow() {
        setSocMed([...socmed, {media: '', link: ''}])
    }

    function removeRow(index : number) {
        let arr = [];
        for (let i = 0; i <= socmed.length - 1; i++) {
            if (i !== index) arr.push(socmed[i]);
        }
        setSocMed(arr);
    }

    function changeArray(index : number, field: 'media' | 'link', value : string) {
        let unMutated = [...socmed];
        unMutated[index][field] = value;
        setSocMed(unMutated);
    }

    async function create() {
        let finalDate = date!.toLocaleDateString('en-CA');
        
        // Concatenate socmed array
        let arr = [];
        for (let i = 0; i <= socmed.length - 1; i++) {
            arr.push(socmed[i].media + "||" + socmed[i].link)
        }

        const obj = {
            first_name : firstName,
            last_name : lastName,
            sex : sex,
            birthday : finalDate as string,
            description: description,
            socmed: arr
        }
      
        const { createActor } = operations(client);
        setLoading(true);
        let hashmap = await createActor(obj);
        if (hashmap.result !== 'success') {
            setMessage(hashmap.result);
            setAlert(true);
            setLoading(false);
        }
        
        else {
            router.push('/actors');
            return;   
        }
    }

    return(
        <>
            <Header currentUser={ undefined } />
            <Box className='flex flex-col justify-center items-center mx-auto md:w-[50vw] bg-black/50 p-6 rounded-lg text-white backdrop-blur-sm'>
                
                <Box className='flex flex-row'>
                    <Box className='mr-[2vw]'>
                        <Tooltip title='Back to Actor Page'>
                            <Button variant='contained'>
                                <ArrowBackIcon />
                            </Button>
                        </Tooltip>
                    </Box>

                    <Typography color='white' variant='h5'> Add an Actor </Typography>
                </Box>

                <Box className='flex flex-row mt-[5vh]'>
                    <Box className='flex flex-col'>
                        <Typography color='white'> First Name </Typography>
                        <Input placeholder='Given Name' onChange={(event) => setFirstName(event.target.value)} />
                    </Box>

                    <Box className='flex flex-col ml-[4vw]'>
                        <Typography color='white'> Last Name </Typography>
                        <Input placeholder='Surname' onChange={(event) => setLastName(event.target.value)} />
                    </Box>
                </Box>

                <Box className='flex flex-row mt-[5vh]'>
                    <Box>
                        <Typography color='white'> Sex at Birth </Typography>
                        <FormControl>
                            <RadioGroup onChange={handleChange} defaultValue="m" name="radio-buttons-group">
                                <Radio slotProps={{ label: { sx: { color: 'white' } } }} value="m" className='color-white' label="Male" variant="outlined" />
                                <Radio slotProps={{ label: { sx: { color: 'white' } } }} value="f" label="Female" variant="outlined" />
                            </RadioGroup>
                        </FormControl>
                    </Box>

                    <Box className='flex flex-col ml-[12vw]'>
                        <Typography color='white'> Birthday </Typography>
                        <DatePicker 
                            selected={ date } 
                            onChange= {(date) => {
                                setDate(date);
                            }}
                            customInput={
                                <input className='bg-white rounded-lg h-[5vh] text-black p-3 font-sans' />
                            }
                        />
                    </Box>
                </Box>

                <Box className='flex flex-col ml-[4vw] mt-[6vh] gap-13'>
                    <Box>
                        <Box className='flex flex-row gap-50'>
                            <Typography variant='body1'>Media</Typography>
                            <Typography variant='body1'>Link</Typography>
                        </Box>

                        {socmed.map((row, index) => (
                            <Box className='flex flex-row mt-[2vh]'>
                                <Input className='w-[10vw]' variant='soft' value={socmed[index].media} onChange={(event) => changeArray(index, 'media', event.target.value)} />
                                <Input className='ml-[3vw]' variant='soft' value={socmed[index].link} onChange={(event) => changeArray(index, 'link', event.target.value)} />
                                {socmed.length > 1 && <Button onClick={() => removeRow(index)} color='warning' className='ml-[2vw]' sx={{width: '2vw'}} variant='text'><DeleteIcon /></Button>}
                                { index === socmed.length - 1 && <Button onClick={addRow} color='info'  sx={{width: '2vw'}} variant='text'><AddIcon /></Button> }
                                
                            </Box>
                        ))}

                    </Box>

                    <Box className='ml-[-1vw]'>
                        <Typography color='white'> Description / Biography </Typography>
                        <Textarea
                        value={description}
                        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value)}
                        placeholder="Write a description for the Actor"
                        className='mt-[2vh] w-[33vw]'
                        minRows={7}
                        maxRows={15}
                        endDecorator = {
                            <Typography variant='body2' sx={{ ml: 'auto' }}>
                                {description.length} character(s)
                            </Typography>
                        }
                        />
                    </Box>
                </Box>

                <Box className='mt-[2vh]'>
                    <Button 
                    variant='contained' 
                    disabled = {loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                    onClick={create}
                    >
                        {loading ? null : 'Create'}
                    </Button>
                </Box>                    
            </Box>

            <Snackbar
            open={alert}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            autoHideDuration={6000}
            onClose={() => setAlert(false)}
            message={message}
            // action={action}
            />
        </>
    )
}