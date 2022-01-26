import express from 'express';
import dotenv from 'dotenv';
import Cache from './services/cache';
import { getHotelRaw, simplifyHotels } from './services/dataLoader';

const app = express();
dotenv.config();

const port = process.env.PORT;
const ttl = 5 * 60;
const cache = new Cache(ttl); // 5min

app.get('/', (req, res) => {
    res.send('The server is working!');
});

app.get('/hotels', async (req, res) => {

    const raw = await getHotelRaw();
    let hotels = simplifyHotels(raw);
    hotels.forEach(hotel => cache.set(hotel, ttl));

    res.send(hotels);
});

app.get('/hotels/:id', async (req, res) => {

    let hotel = cache.get(`${req.params.id}`);
    console.log(hotel);
    res.send(hotel);
});

app.listen(port, () => {
    console.log(`server is listening on ${port} !!!`);
});
