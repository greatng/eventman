import { getCookie } from 'cookies-next';
import Head from 'next/head';
import { Button, Typography, Box, Container } from '@mui/material';

export default function Home() {
    return (
        <Container maxWidth="lg">
            <Head>
                <title>42Bangkok Eventmanager</title>
            </Head>
            <Box flex flexDirection={'column'} height={'100vh'}>
                <Box
                    justifyContent={'center'}
                    display={'flex'}
                    minHeight={'55vh'}
                    alignItems={'flex-end'}
                >
                    <Typography
                        fontSize={['5.5vmax']}
                        fontWeight={'lighter'}
                        textAlign="center"
                    >
                        42Bangkok Eventmanager
                    </Typography>
                </Box>
                <Box
                    justifyContent={'center'}
                    display={'flex'}
                    minHeight={'10vh'}
                    alignItems={'flex-end'}
                >
                    <Button variant="outlined" href="api/google">
                        Login with Google
                    </Button>
                </Box>
                <Box
                    display={'flex'}
                    justifyContent={'center'}
                    minHeight={'35vh'}
                    alignItems={'flex-end'}
                >
                    <Typography
                        fontWeight={'lighter'}
                        fontSize={['1vmax', '0.7vmax']}
                        color={'gray'}
                        fontFamily={'monospace'}
                    >
                        Dashboard v1.0.10
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}

// pre-render landing page
// if cookie exist and match one of user token it will redirect to dashboard
export async function getServerSideProps({ req, res }) {
    try {
        const cookieExists = getCookie('token', { req, res });
        if (cookieExists) return { redirect: { destination: '/dashboard' } };
        return { props: {} };
    } catch (err) {
        return { props: {} };
    }
}
