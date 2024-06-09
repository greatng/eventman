import { getCookie, deleteCookie } from 'cookies-next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import connect from '../lib/database';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import ButtonAppBar from '../components/ButtonAppBar';
import { Container, Grid, Alert, Box, Typography } from '@mui/material';
import InputField from '../components/InputField';
import EventDisplay from '../components/EventDisplay';
import RickRoll from '../components/RickRoll';

// Maindisplay (call from Dashboard)
// if user have no permission it will display Rickroll
// otherwise it will show inputfield and eventdisplay (see component)
function MainDisplay({ roles, permission }) {
    const [fetchEvent, setFetchEvent] = useState(true);
    let onlyAdmin;
    let role;
    if (permission) {
        role = 'Superadmin';
        onlyAdmin = (
            <Container>
                <Grid item width="100%">
                    <InputField setFetchEvent={setFetchEvent} />
                </Grid>
                <Grid item width="100%">
                    <EventDisplay
                        fetchEvent={fetchEvent}
                        setFetchEvent={setFetchEvent}
                    />
                </Grid>
            </Container>
        );
    } else {
        role = 'Outsider, please contact you administrator.';
        onlyAdmin = (
            <Grid item width="100%">
                <RickRoll />
            </Grid>
        );
    }
    const loginAlert = (
        <Alert severity="info" sx={{ mb: 2 }}>
            You are logged in as {role}
        </Alert>
    );

    return (
        <Box
            display="flex"
            sx={{
                mt: 10,
                minwidth: 390,
            }}
        >
            <Grid
                container
                direction="column"
                justifyContent="space-evenly"
                alignItems="center"
                spacing={1}
            >
                <Grid item width="100%">
                    {loginAlert}
                </Grid>
                {onlyAdmin}
            </Grid>
        </Box>
    );
}

function Dashboard({ name, email, roles, permission }) {
    return (
        <Container minwidth="100vh">
            <ButtonAppBar roles={roles} email={email}></ButtonAppBar>
            <Head>
                <title>42Eventmanager Dashboard</title>
            </Head>
            <MainDisplay
                roles={roles}
                name={name}
                permission={permission}
            ></MainDisplay>
        </Container>
    );
}

// post to UAC to add account if not exist
async function postUAC(obj) {
    console.log('Creating uac user...');
    const fullName = obj.name.split(' ');
    const response = await fetch(`${process.env.REACT_APP_UAC_POST_USER}`, {
        method: 'POST',
        body: JSON.stringify({
            name: fullName[0],
            lastname: fullName[1],
            email: obj.email,
        }),
        headers: {
            'Content-type': 'application/json',
        },
    });
    // console.log(response);
}

// check if email exist in UAC
async function checkUAC(obj) {
    console.log('Checking uac...');
    let response;
    try {
        response = await (
            await fetch(
                `${process.env.REACT_APP_UAC_GET_PERMISSION}${obj.email}`
            )
        ).json();
        if (!response.email) {
            await postUAC(obj);
            response = await checkUAC(obj);
        }
    } catch (err) {
        console.error('uac error:', err.type, err.code);
    }
    return response;
}

// verify if cookie match any user in DB. if not it will send back to landing page
export async function getServerSideProps({ req, res }) {
    try {
        // connect db
        await connect();
        // check cookie
        const token = getCookie('token', { req, res });
        if (!token)
            return {
                redirect: {
                    destination: '/',
                },
            };

        const verified = await jwt.verify(token, process.env.JWT_SECRET);
        const obj = await User.findOne({ _id: verified.id });
        if (!obj)
            return {
                redirect: {
                    destination: '/',
                },
            };
        let response = await checkUAC(obj);
        console.log('UAC response', response);
        return {
            props: {
                email: obj.email,
                name: obj.name,
                roles: response.roles ? response.roles : ['outsider'],
                permission: response.permissions.includes('eventmanager')
                    ? true
                    : false,
            },
        };
    } catch (err) {
        deleteCookie('token', { req, res });
        return {
            redirect: {
                destination: '/',
            },
        };
    }
}

export default Dashboard;
