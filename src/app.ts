import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './controllers/routes';

// create application object
const app: express.Application = express();

const corsOptions = {
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

// setting the [root path] to the routes middleware
app.use('/store', routes);

export default app;
