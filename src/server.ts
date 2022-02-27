import dotenv from 'dotenv';
dotenv.config();

import app from './app';

const port: string = process.env.PORT as string;

// listen to the server
app.listen(port, function () {
    console.log(`starting app on http://localhost:${port}`);
});
