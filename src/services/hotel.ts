import axios from 'axios';
import Hotel from '../models/hotel';
import cache from '../repos/cache';

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

async function loadHotels() {
    const raw = await getHotelRaw();
    let hotels = parseHotels(raw);

    cache.mset(hotels);
    console.log(new Date() + ': Successfully loaded hotels');
}

function searchHotels(countryName: string, cityName?: string) {
    let res: Hotel[] = [];
    const hotels = cache.getAll();
    if (cityName == undefined) {
        hotels.forEach(hotel => {
            if (hotel.address.countryCode == countryName) {
                res.push(hotel);
            }
        });
    } else {
        hotels.forEach(hotel => {
            if (hotel.address.countryCode == countryName
                && hotel.address.cityName == cityName) {
                res.push(hotel);
            }
        });
    }

    return res;
}

export { loadHotels, searchHotels };