import { getCookie, deleteCookie } from 'cookies-next';
import Head from 'next/head';
import React from 'react';
import connect from '../lib/database';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import ButtonAppBar from '../components/ButtonAppBar';
import { Container, Grid, Box, Typography } from '@mui/material';
import SuperAdminData from '../components/SuperAdminData';

// Call SuperAdminData component
function Superadmin({ name, email, roles, alluser }) {
    return (
        <Container minwidth="100vh">
            <ButtonAppBar roles={roles} email={email}></ButtonAppBar>
            <Head>
                <title>42Eventmanager SUPERADMIN</title>
            </Head>
            <Box sx={{ mt: 10 }}>
                <SuperAdminData alluser={alluser}></SuperAdminData>
            </Box>
        </Container>
    );
}

// check if user is Superadmin. if not it will redirect to landing page
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
        if (!obj || !obj.roles.includes('SUPERADMIN'))
            return {
                redirect: {
                    destination: '/',
                },
            };
        const allUser = await User.find({});
        return {
            props: {
                email: obj.email,
                name: obj.name,
                roles: obj.roles,
                alluser: JSON.parse(JSON.stringify(allUser)),
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

export default Superadmin;
