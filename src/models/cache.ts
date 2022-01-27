import NodeCache from 'node-cache';
import Hotel from './hotel';

class Cache {

    cache: NodeCache;

    constructor(ttlSeconds: number) {
        this.cache = new NodeCache({
            stdTTL: ttlSeconds,
            checkperiod: ttlSeconds * 0.2,
            useClones: false
        });
    }

    get(key: string) {
        const value = this.cache.get(key);
        if (value) {
            return value;
        }
    }

    set(hotel: Hotel, ttl: number) {
        this.cache.set(hotel.hotelId, hotel, ttl);
    }

    mset(hotels: Hotel[]) {
        let dict = new Array;
        hotels.forEach(hotel =>
            dict.push({ key: hotel.hotelId, val: hotel }));
        this.cache.mset(dict);
    }

    getTtl(hotel: Hotel) {
        return this.cache.getTtl(hotel.hotelId);
    }

    getAll() {
        let hotels: Array<any> = []
        const keys = this.cache.keys();
        keys.forEach(key => {
            let obj = this.cache.get(key);
            if (obj !== undefined) {
                hotels.push(obj);
            }
        });
        return hotels;
    }

}

export default Cache;