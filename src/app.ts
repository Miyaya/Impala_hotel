import express from 'express';
import dotenv from 'dotenv';
import { loadHotels } from './services/hotel';
import syncHotels from './services/cronJob';

const app = express();
dotenv.config();

const port = process.env.PORT;

const router = require('./routers/index');
app.use(router);

loadHotels();
syncHotels();

app.listen(port, () => {
    console.log(`server is listening on ${port} !!!`);
});
