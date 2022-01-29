import Cache from '../cache';
import Hotel from '../hotel';
import dotenv from 'dotenv';

dotenv.config();
const cache = new Cache(Number(`${process.env.TTL_CACHE}`));

describe('mset', () => {
    it('should save <hotelId, hotel> in cache', async () => {

        cache.cache.mset = jest.fn().mockImplementation();

        cache.mset(hotels);

        expect(cache.cache.mset).toHaveBeenCalledTimes(1);
        expect(cache.cache.mset).toBeCalledWith([
            { key: hotel1.hotelId, val: hotel1 },
            { key: hotel2.hotelId, val: hotel2 }]);
    })
});

describe('getAll', () => {
    it('should get all hotels', async () => {
        let hotelKeys = [hotel1.hotelId, hotel2.hotelId];
        cache.cache.keys = jest.fn().mockReturnValue(hotelKeys);
        cache.cache.get = jest.fn()
            .mockReturnValueOnce(hotel1)
            .mockReturnValueOnce(hotel2);
        let res = cache.getAll();

        expect(cache.cache.keys).toHaveBeenCalledTimes(1);
        expect(res).toEqual(hotels);
        expect(cache.cache.get).toBeCalledTimes(2);
        expect(cache.cache.get).toHaveBeenCalledWith(hotel1.hotelId);
        expect(cache.cache.get).toHaveBeenCalledWith(hotel2.hotelId);
    })
});



const hotel1 = new Hotel('2196c8c9-bc59-4f0f-81bf-3b1e59dfe215', 'GBR', 'Portpatrick', 'Harbour House Hotel [SANDBOX]', 'The Harbour House Hotel, and Anglesea Apartments is located in the picturesque seaside village of Portpatrick, Dumfries and Galloway. Settled in south west Scotland with views over the Irish Sea, the hotel has a seafront terraced restauran  as well as a cosy lounge and bar area.', `{ 
    "0": { 
        "altText": null, 
        "height": 777, 
        "width": 1600, 
        "url": "https://cdn.impala.travel/properties/ckn8rkt4100rg0snn5uoe6ev4.jpg", 
        "isHeroImage": true 
    } 
}`);

const hotel2 = new Hotel('8600bc8b-5c0f-4aae-9bcd-b44cde7bfbce', 'GBR', 'Portpatrick', 'Waterfront Portpatrick  [SANDBOX]', 'The Waterfront Hotel is a small quaint hotel with a nautical theme right on the harbour in the beautiful village of Portpatrick, with a large terrace and quaint cozy small lounge, and a bright Bistro restaurant.', `{
    "0": {
        "altText": null,
        "height": 768,
        "width": 1024,
        "url": "https://cdn.impala.travel/properties/ckn8rx2eq00sp0snne3co5f0g.jpg",
        "isHeroImage": true
    }
}`)
const hotels = [hotel1, hotel2];