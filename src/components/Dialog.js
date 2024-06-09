import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import {
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText,
} from '@mui/material';

// Dialog to show when input date is wrong
function AlertDialog({ open, setOpen }) {
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Error</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    1. End date should be always greater than start date.
                    <br></br>
                    OR
                    <br></br>
                    2. Please choose at least 1 channel. (Discord or Intra)
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AlertDialog;
