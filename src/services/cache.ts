import NodeCache from 'node-cache';
import Hotel from '../models/hotel';

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
            // return Promise.resolve(value);
            return value;
        }
    }

    set(hotel: Hotel, ttl: number) {
        this.cache.set(hotel.hotelId, hotel, ttl);
    }

    del(key: string) {
        this.cache.del(key);
    }

    flush() {
        this.cache.flushAll();
    }
}

export default Cache;