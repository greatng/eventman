import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import CircularProgress from '@mui/material/CircularProgress';
import {
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText,
    TextField,
    Box,
    Typography,
} from '@mui/material';
import dayjs from 'dayjs';

// Dialog to show when input date is wrong
function ConfirmationBox({
    openCf,
    setOpenCf,
    setCallAPI,
    setLoading,
    loading,
    postValue,
}) {
    const handleClose = () => {
        setOpenCf(false);
    };

    const handleProceed = () => {
        setCallAPI(true);
        setLoading(true);
    };

    return (
        <Dialog open={openCf} onClose={handleClose} fullWidth>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {postValue && (
                        <Typography key={postValue.title} variant="body2">
                            Title : {postValue.title}
                            <br></br>
                            Location : {postValue.location}
                            <br></br>
                            Description : {postValue.description}
                            <br></br>
                            Start Date :{' '}
                            {dayjs(postValue.scheduled_start_time).format(
                                'DD/MM/YY hh:mmA'
                            )}
                            <br></br>
                            End Date :{' '}
                            {dayjs(postValue.scheduled_end_time).format(
                                'DD/MM/YY hh:mmA'
                            )}
                            <br></br>
                            Post to Discord :{' '}
                            {postValue.postdiscord ? 'Yes' : 'No'}
                            <br></br>
                            Post to Intra : {postValue.postintra ? 'Yes' : 'No'}
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
                        Please make sure that all informations above are
                        correct.
                    </Box>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleProceed}>
                    Proceed
                </Button>
                {loading && (
                    <CircularProgress
                        size={30}
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-12px',
                            marginLeft: '-12px',
                        }}
                    />
                )}
                <Button variant="contained" onClick={handleClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmationBox;
