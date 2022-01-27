import express from 'express';
import dotenv from 'dotenv';
import Cache from './repos/cache';
const cron = require('node-cron');
import { loadHotels } from './services/hotels';

const app = express();
dotenv.config();

const port = process.env.PORT;
const cache = new Cache(Number(process.env.TTL_CACHE));

loadHotels(cache);
let minutes = new Date().getMinutes();
//cron.schedule(`${minutes} * * * *`, function () {
cron.schedule(`* * * * *`, function () {
    loadHotels(cache);
});

app.get('/', (req, res) => {
    res.send('The server is working!');
});

app.get('/hotels/:id', async (req, res) => {

    let hotel = cache.get(`${req.params.id}`);
    console.log(hotel);
    res.send(hotel);
});

app.listen(port, () => {
    console.log(`server is listening on ${port} !!!`);
});
