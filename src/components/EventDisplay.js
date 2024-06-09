import { Typography, Box, Snackbar, Alert } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useEffect, useState, useCallback } from 'react';
import DeleteConfirmation from './DeleteConfirmation';
import dayjs from 'dayjs';

async function callDeleteApi(
    eventParams,
    setFetchEvent,
    setOpenSnack,
    setStatus
) {
    let response;
    try {
        // console.log('params =', eventParams);
        response = await fetch(`/api/events/`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                eventid: eventParams.id,
                discordeventid: eventParams.discordeventid,
                intraeventid: eventParams.intraeventid,
            }),
        });
        if (!response.ok) {
            setStatus('error');
        } else {
            setFetchEvent(true);
            setStatus('success');
        }
    } catch (err) {
        console.log('error: ', err);
        setStatus('error');
    }
    // await new Promise(r => setTimeout(r, 2000));
    setOpenSnack(true);
}

//Show SnackBar (lower left bar) when delete success or failed
function StatusSnackbar({ open, setOpen, status, setStatus }) {
    const handleClose = () => {
        setOpen(false);
        setStatus();
    };
    let snackString;
    if (status == 'success') snackString = 'Delete success!';
    else if (status == 'error') snackString = 'Delete error!';
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

// Event Display component will fetch event from DB when loading
// or when fetchEvent state change (See useEffect)
function EventDisplay({ fetchEvent, setFetchEvent }) {
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(null);
    const [eventDelete, setEventDelete] = useState(false);
    const [eventParams, setEventParams] = useState({ title: '' });
    const [openSnack, setOpenSnack] = useState(false);
    const [status, setStatus] = useState();

    useEffect(() => {
        if (fetchEvent) {
            const getData = async () => {
                try {
                    const response = await fetch(`/api/events`);
                    if (!response.ok) {
                        throw new Error(
                            `This is an HTTP error: The status is ${response.status}`
                        );
                    }
                    const actualData = await response.json();
                    // console.og(actualData);
                    setRows(
                        actualData.map((eventEntry, idx) => ({
                            id: eventEntry._id,
                            idx: idx + 1,
                            location: eventEntry.location,
                            title: eventEntry.title,
                            start: new Date(eventEntry.scheduled_start_time),
                            end: new Date(eventEntry.scheduled_end_time),
                            description: eventEntry.description,
                            postdiscord: eventEntry.postdiscord,
                            postintra: eventEntry.postintra,
                            discordeventid: eventEntry.discordeventid,
                            intraeventid: eventEntry.intraeventid,
                        }))
                    );
                    setError(null);
                } catch (err) {
                    setError(err.message);
                }
            };
            getData();
            setFetchEvent(false);
        }
    }, [fetchEvent, setFetchEvent]);

    const deleteEvent = useCallback(
        (params) => () => {
            setEventParams(params);
            setOpen(true);
        },
        []
    );

    useEffect(
        () => async () => {
            if (eventDelete) {
                await callDeleteApi(
                    eventParams,
                    setFetchEvent,
                    setOpenSnack,
                    setStatus
                );
            }
            setEventDelete(false);
        },
        [eventDelete]
    );

    const columns = [
        { field: 'idx', headerName: 'No.', width: 50, sortable: false },
        { field: 'title', headerName: 'Title', minWidth: 100, sortable: false },
        {
            field: 'location',
            headerName: 'Location',
            minWidth: 100,
            sortable: false,
        },
        {
            field: 'description',
            headerName: 'Description',
            minWidth: 200,
            sortable: false,
            flex: 1,
        },
        {
            field: 'start',
            headerName: 'Start Date',
            type: 'dateTime',
            minWidth: 170,
            valueFormatter: (params) =>
                dayjs(params?.value).format('DD/MM/YYYY hh:mm A'),
        },
        {
            field: 'end',
            headerName: 'End Date',
            type: 'dateTime',
            minWidth: 170,
            valueFormatter: (params) =>
                dayjs(params?.value).format('DD/MM/YYYY hh:mm A'),
        },
        {
            field: 'postdiscord',
            headerName: 'Discord',
            type: 'boolean',
            minWidth: 20,
        },
        {
            field: 'postintra',
            headerName: 'Intra',
            type: 'boolean',
            minWidth: 20,
        },
        {
            field: 'actions',
            headerName: 'Delete',
            type: 'actions',
            minWidth: 20,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<DeleteForeverIcon />}
                    label="Delete"
                    onClick={deleteEvent(params.row)}
                    key={params.id}
                />,
            ],
        },
    ];

    return (
        <Box sx={{ height: '600px', width: '100%' }}>
            <StatusSnackbar
                open={openSnack}
                setOpen={setOpenSnack}
                status={status}
                setStatus={setStatus}
            ></StatusSnackbar>
            <DeleteConfirmation
                open={open}
                setOpen={setOpen}
                setEventDelete={setEventDelete}
                eventParams={eventParams}
            ></DeleteConfirmation>
            <Box sx={{ display: 'flex' }}>
                <Typography
                    sx={{ flexGrow: 1, my: 2 }}
                    variant="h6"
                    key="Event entries"
                >
                    Event Entries
                </Typography>
            </Box>
            <DataGrid
                rows={rows}
                columns={columns}
                filterMode="client"
                filterModel={{
                    items: [
                        {
                            columnField: 'end',
                            operatorValue: 'after',
                            value: dayjs().format(),
                        },
                    ],
                }}
                getRowHeight={() => 'auto'}
                getEstimatedRowHeight={() => 300}
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'idx', sort: 'desc' }],
                    },
                }}
                sx={{
                    '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': {
                        py: '8px',
                    },
                    '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
                        py: '15px',
                    },
                    '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell':
                        { py: '22px' },
                }}
            />
        </Box>
    );
}

export default EventDisplay;
