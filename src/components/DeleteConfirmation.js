import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import {
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText,
    Typography,
    Box,
} from '@mui/material';
import dayjs from 'dayjs';

// Confirmation delete dialog
function DeleteConfirmation({ open, setOpen, setEventDelete, eventParams }) {
    const handleClose = () => {
        setOpen(false);
    };

    const handleProceed = () => {
        setEventDelete(true);
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>Delete</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {eventParams && (
                        <Typography key={eventParams.title} variant="body2">
                            Title : {eventParams.title}
                            Location : {eventParams.location}
                            <br></br>
                            Description : {eventParams.description}
                            <br></br>
                            Start Date :{' '}
                            {dayjs(eventParams.start).format('DD/MM/YY hh:mmA')}
                            <br></br>
                            End Date :{' '}
                            {dayjs(eventParams.end).format('DD/MM/YY hh:mmA')}
                            <br></br>
                            Is event on Discord :{' '}
                            {eventParams.postdiscord ? 'Yes' : 'No'}
                            <br></br>
                            Is event on Intra :{' '}
                            {eventParams.postintra ? 'Yes' : 'No'}
                            <br></br>
                        </Typography>
                    )}
                    <Box
                        component="span"
                        sx={{
                            display: 'block',
                            borderRadius: 2,
                            fontSize: '0.875rem',
                            fontWeight: '700',
                        }}
                    >
                        Event will be deleted from both Intra and Discord.
                    </Box>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleProceed}>
                    Delete
                </Button>
                <Button variant="contained" onClick={handleClose}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeleteConfirmation;
