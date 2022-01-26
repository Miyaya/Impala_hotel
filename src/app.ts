import express from 'express';
import Hotel from './interfaces/hotel';
import Cache from './services/cache';

const app = express();
const port = 3000;
const ttl = 60 * 60;
const cache = new Cache(ttl); // 1hr

app.get('/', (req, res) => {
    res.send('The server is working!');
});

app.get('/hotels', (req, res) => {
    cache.set(new Hotel('111', 'FR', 'xHotel', 'This is an example', 'https://google.com'), ttl);
    let hotel = cache.get('111');
    res.send(hotel);
});

app.listen(port, () => {
    console.log(`server is listening on ${port} !!!`);
});
