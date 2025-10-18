// import Drawer from '@mui/joy/Drawer';
// import Button from '@mui/joy/Button';
// import { Box, Divider, Grid, List, ListItem, ListItemButton, Typography } from '@mui/joy';
// import { useState } from 'react';
// import Link from 'next/link';

// export function Sidebar () {
//     const [open, setOpen] = useState(false);
//     const [key, setKey] = useState('')
//     const hoverBgColor = '#4A5C4D';

//     return (
//         <>
//             <div className='z-10 absolute ml-10 mt-10 font-normal text-blue'>
//                 <Button variant='soft' onClick ={() => setOpen(true)} sx = {{ outline: 'none !important'}}>
//                      Menu 
//                 </Button>
//             </div>

//         <Drawer open={open} 
//         size='sm'
//         variant='soft' 
//         anchor='left' 
//         onMouseOver={() => {}}
//         onMouseLeave={() => setOpen(false)}
//         onClose={() => setOpen(false)}
//         >
//             <Box role="presentation" className='p-5' sx = {{ flexGrow: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#4A5C4D' }}>
//                 <List>
//                     {['Home', 'Create Character', 'Send email', 'Drafts'].map((text) => (
                        
//                     <Link to={text === 'Create Character' ? 'characters/creation/origins' : 
//                     text === 'Home' ? '/' : text} className='font-normal'>
//                     <ListItem key={text} 
//                     onMouseOver={() => setKey(text)}
//                     onMouseLeave={() => setKey('')}
//                     sx = {{backgroundColor: key === text ? '#5C6C60' : hoverBgColor}}>
//                         <Typography variant='plain' level='body-md'>
//                             <span className='text-gray-50'>
//                             {text}
//                             </span>
//                         </Typography>
//                     </ListItem>
//                     </Link>
//                     ))}
//                 </List>

//             <Divider />

//                 <List>
//                     {['All mail', 'Trash', 'Spam'].map((text) => (
//                     <ListItem key={text}>
//                         <ListItemButton>{text}</ListItemButton>
//                     </ListItem>
//                     ))}
//                 </List>
//             </Box>
//         </Drawer>

//         </>
//     )
// }