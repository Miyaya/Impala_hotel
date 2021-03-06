import express from 'express';
import httpStatus from 'http-status';
import { searchHotels } from '../services/hotel';
const router = express.Router()

router.get('/', (req: express.Request, res: express.Response) => {
    res.send('The server is working!');
})

router.get('/hotels', async (req: express.Request, res: express.Response) => {
    if (req.query.countryCode == undefined) {
        res.status(httpStatus.BAD_REQUEST).send('countryCode is required!');
    } else {
        let hotel;
        if (req.query.cityName == undefined) {
            hotel = searchHotels(`${req.query.countryCode}`);
        } else {
            hotel = searchHotels(`${req.query.countryCode}`, `${req.query.cityName}`);
        }
        res.send(hotel);
    }
});

module.exports = router