import mongoose from 'mongoose';

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html>
            <Head />
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}

// Register event listener
// If app terminating, it will call cleanUp and then exit

if (process.env.NEXT_MANUAL_SIG_HANDLE) {
    console.log('Registered EventListener');
    process.on('SIGTERM', () => {
        console.log('Received SIGTERM: ', 'cleaning up');
        mongoose.disconnect().then(() => {
            setTimeout(() => console.log('SIGTERM'), 5000);
        });
    });

    process.on('SIGINT', () => {
        console.log('Received SIGINT: ', 'cleaning up');
        mongoose.disconnect().then(() => {
            setTimeout(() => console.log('SIGTERM'), 5000);
        });
    });
}
