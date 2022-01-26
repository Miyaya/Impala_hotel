import axios from 'axios';
import Hotel from '../models/hotel';

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

function simplifyHotels(hotelRaw: any[]) {
    let hotels: Hotel[] = [];
    hotelRaw.forEach(raw => {
        const hotel = new Hotel(raw.hotelId, raw.address.country,
            raw.name, raw.description.short, raw.images[0]);
        hotels.push(hotel);
    });
    return hotels;
}

export { getHotelRaw, simplifyHotels };