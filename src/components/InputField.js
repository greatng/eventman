import { TextField, Grid, Button, Stack, Snackbar, Alert } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import AlertDialog from './Dialog';
import ConfirmationBox from './ConfirmationBox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

// Submitting InputField form will call this function
// This function will post to local API endpoint (nodejs)
// Then it will save event detail in evententries DB and then call BE API
// see pages/api/event/index.js for more details
async function callPostApi(
    postValue,
    setStatus,
    setFetchEvent,
    setOpenSnack,
    setLoading
) {
    let response;
    console.log(postValue);
    try {
        response = await fetch(`/api/events/`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                ...postValue,
                expiredAt: new Date(postValue?.scheduled_end_time),
            }),
        });
        if (!response.ok) {
            console.error('response not ok');
            setStatus('error');
        } else setStatus('success');
    } catch (err) {
        console.error('error: ', err);
        setStatus('error');
    }
    // await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setFetchEvent(true);
    setOpenSnack(true);
}

//Show SnackBar (lower left bar) when post success or failed
function StatusSnackbar({ open, setOpen, status, setStatus }) {
    const handleClose = () => {
        setOpen(false);
        setStatus();
    };
    let snackString;
    if (status == 'success') snackString = 'Post event success!';
    else if (status == 'error') snackString = 'Post event error!';
    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert
                onClose={handleClose}
                severity={status}
                sx={{ width: '100%' }}
            >
                {snackString}
            </Alert>
        </Snackbar>
    );
}

// Date sub-component
function DateController({ control, name, label, timeAdd }) {
    return (
        <Controller
            name={name}
            control={control}
            defaultValue={dayjs().add(timeAdd, 'hour')}
            render={({ field: { onChange, value } }) => (
                <MobileDateTimePicker
                    disablePast
                    renderInput={(props) => (
                        <TextField {...props} sx={{ mr: 2, mb: 1 }} />
                    )}
                    label={label}
                    value={value}
                    onChange={(value) => {
                        onChange(dayjs(value).format());
                    }}
                />
            )}
        />
    );
}

// Inputfield for entering event detail
function InputField({ setFetchEvent }) {
    const [open, setOpen] = useState(false);
    const [openCf, setOpenCf] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [status, setStatus] = useState();
    const [postValue, setPostValue] = useState(null);
    const [callAPI, setCallAPI] = useState(false);
    const { register, handleSubmit, control } = useForm();
    const [loading, setLoading] = useState(false);

    const submitHandler = async (value) => {
        const date2 = dayjs(value.scheduled_start_time);
        const date1 = dayjs(value.scheduled_end_time);
        const diffDate = date1.diff(date2);

        // console.log(value.postdiscord, value.postintra);
        if (
            diffDate < 0 ||
            !diffDate ||
            (!value.postdiscord && !value.postintra)
        )
            setOpen(true);
        else {
            setPostValue(value);
            setOpenCf(true);
        }
    };

    useEffect(
        () => async () => {
            if (callAPI) {
                await callPostApi(
                    postValue,
                    setStatus,
                    setFetchEvent,
                    setOpenSnack,
                    setLoading
                );
            }
            setCallAPI(false);
        },
        [callAPI]
    );

    return (
        <>
            <ConfirmationBox
                openCf={openCf}
                setOpenCf={setOpenCf}
                setCallAPI={setCallAPI}
                setLoading={setLoading}
                loading={loading}
                postValue={postValue}
            ></ConfirmationBox>
            <AlertDialog open={open} setOpen={setOpen}></AlertDialog>
            <StatusSnackbar
                open={openSnack}
                setOpen={setOpenSnack}
                status={status}
                setStatus={setStatus}
            ></StatusSnackbar>
            <form onSubmit={handleSubmit(submitHandler)}>
                <Stack spacing={2}>
                    <Grid item>
                        <TextField
                            label="Title"
                            fullWidth={true}
                            required
                            {...register('title')}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            label="Location"
                            fullWidth={true}
                            required
                            {...register('location')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Description"
                            multiline
                            rows={4}
                            fullWidth={true}
                            required
                            {...register('description')}
                        />
                    </Grid>
                    <Grid>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateController
                                name="scheduled_start_time"
                                control={control}
                                label="Start Date"
                                timeAdd={1}
                            ></DateController>
                            <DateController
                                name="scheduled_end_time"
                                control={control}
                                label="End Date"
                                timeAdd={2}
                            ></DateController>
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={4}>
                        <FormGroup row>
                            <FormControlLabel
                                control={
                                    <Checkbox {...register('postdiscord')} />
                                }
                                label="Cadet Discord"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox {...register('postintra')} />
                                }
                                label="Intra"
                            />
                        </FormGroup>
                    </Grid>
                    <Stack direction="row">
                        <Button
                            type={'submit'}
                            variant="outlined"
                            sx={{ mr: 2 }}
                        >
                            Submit
                        </Button>
                        <Button type={'reset'} variant="contained">
                            Reset
                        </Button>
                    </Stack>
                </Stack>
            </form>
        </>
    );
}

export default InputField;
