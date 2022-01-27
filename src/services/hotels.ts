import axios from 'axios';
import Hotel from '../models/hotel';
import Cache from '../repos/cache';

async function getHotelRaw() {
    const requestUrl = `${process.env.IMPALA_API_URL}`;
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-KEY': `${process.env.API_KEY}`,
    };

    const raw = await axios.get(requestUrl, { headers: headers });
    let hotels = raw.data.data;
    return hotels;
}

function parseHotels(hotelRaw: any[]) {
    let hotels: Hotel[] = [];
    hotelRaw.forEach(raw => {
        const hotel = new Hotel(raw.hotelId, raw.address.country, raw.address.city,
            raw.name, raw.description.short, raw.images[0]);
        hotels.push(hotel);
    });
    return hotels;
}

async function loadHotels(cache: Cache) {
    const raw = await getHotelRaw();
    let hotels = parseHotels(raw);

    cache.mset(hotels);
    console.log(new Date() + ': Successfully loaded hotels');
}

export { loadHotels };