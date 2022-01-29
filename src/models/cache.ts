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

    mset(hotels: Hotel[]) {
        let dict = new Array;
        hotels.forEach(hotel =>
            dict.push({ key: hotel.hotelId, val: hotel }));
        this.cache.mset(dict);
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