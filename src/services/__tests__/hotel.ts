import { getHotelRaw, parseHotels, loadHotels, searchHotels } from '../hotel';
import axios from 'axios';
import cache from '../../repos/cache';

describe('getHotelRaw', () => {
    it('should get hotels from Impala api', async () => {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-API-KEY': `${process.env.API_KEY}`,
        };
        axios.get = jest.fn().mockResolvedValue(mockHotelRaw);

        const actualValue = await getHotelRaw();

        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toBeCalledWith(`${process.env.IMPALA_API_URL}`, { headers: headers });
        expect(actualValue).toEqual(mockHotelRaw.data.data);
    })
});

describe('parseHotels', () => {
    it('should parse required hotel properties', async () => {
        const expectedHotels = [{
            "hotelId": "2196c8c9-bc59-4f0f-81bf-3b1e59dfe215",
            "address": {
                "countryCode": "GBR",
                "cityName": "Portpatrick "
            },
            "title": "Harbour House Hotel [SANDBOX]",
            "description": {
                "short": "The Harbour House Hotel, and Anglesea Apartments is located in the picturesque seaside village of Portpatrick, Dumfries and Galloway. Settled in south west Scotland with views over the Irish Sea, the hotel has a seafront terraced restauran  as well as a cosy lounge and bar area."
            },
            "imageUrls": {
                "0": {
                    "altText": null,
                    "height": 777,
                    "width": 1600,
                    "url": "https://cdn.impala.travel/properties/ckn8rkt4100rg0snn5uoe6ev4.jpg",
                    "isHeroImage": true
                }
            }
        },
        {
            "hotelId": "8600bc8b-5c0f-4aae-9bcd-b44cde7bfbce",
            "address": {
                "countryCode": "GBR",
                "cityName": "Portpatrick"
            },
            "title": "Waterfront Portpatrick  [SANDBOX]",
            "description": {
                "short": "The Waterfront Hotel is a small quaint hotel with a nautical theme right on the harbour in the beautiful village of Portpatrick, with a large terrace and quaint cozy small lounge, and a bright Bistro restaurant. "
            },
            "imageUrls": {
                "0": {
                    "altText": null,
                    "height": 768,
                    "width": 1024,
                    "url": "https://cdn.impala.travel/properties/ckn8rx2eq00sp0snne3co5f0g.jpg",
                    "isHeroImage": true
                }
            }
        }];

        const res = await parseHotels(mockHotels);

        expect(res).toEqual(expectedHotels);
    })
});

describe('loadHotels', () => {
    it('should call mset once', async () => {
        axios.get = jest.fn().mockResolvedValue(mockHotelRaw);
        cache.mset = jest.fn().mockImplementation();

        await loadHotels();

        expect(cache.mset).toHaveBeenCalledTimes(1);
    })
});

describe('searchHotels', () => {
    it('should provide all matched data given country code', async () => {
        const countryCode = 'GBR';
        cache.getAll = jest.fn().mockReturnValue(mockHotelsFromCache);

        let hotels = searchHotels(countryCode);

        expect(cache.getAll).toHaveBeenCalledTimes(1);
        expect(hotels).toEqual(mockHotelsFromCache);
    });

    it('should provide all matched data given country code and city name', async () => {
        const countryCode = 'GBR';
        const cityName = 'Portpatrick';
        cache.getAll = jest.fn().mockReturnValue(mockHotelsFromCache);

        let hotels = searchHotels(countryCode);

        expect(cache.getAll).toHaveBeenCalledTimes(1);
        expect(hotels).toEqual(mockHotelsFromCache);
    })

    it('should return empty array when no correspondent data', async () => {
        const countryCode = 'GBR';
        const cityName = 'Impalaland';
        cache.getAll = jest.fn().mockReturnValue(mockHotelsFromCache);

        let hotels = searchHotels(countryCode, cityName);

        expect(cache.getAll).toHaveBeenCalledTimes(1);
        expect(hotels).toEqual([]);
    })
});


const mockHotelRaw = {
    "data": {
        "data": [{
            "hotelId": "2196c8c9-bc59-4f0f-81bf-3b1e59dfe215",
            "name": "Harbour House Hotel [SANDBOX]",
            "currency": "GBP",
            "starRating": 3,
            "description": {
                "short": "The Harbour House Hotel, and Anglesea Apartments is located in the picturesque seaside village of Portpatrick, Dumfries and Galloway. Settled in south west Scotland with views over the Irish Sea, the hotel has a seafront terraced restauran  as well as a cosy lounge and bar area."
            },
            "phoneNumbers": [
                "01776 810456"
            ],
            "contractable": true,
            "emails": [
                "gdapi-staging-hotel+2196c8c9-bc59-4f0f-81bf-3b1e59dfe215@getimpala.com"
            ],
            "websiteUrl": null,
            "images": [
                {
                    "altText": null,
                    "height": 777,
                    "width": 1600,
                    "url": "https://cdn.impala.travel/properties/ckn8rkt4100rg0snn5uoe6ev4.jpg",
                    "isHeroImage": true
                },
                {
                    "altText": null,
                    "height": 768,
                    "width": 1024,
                    "url": "https://cdn.impala.travel/properties/ckn8rjp0g00r30snnainlafdm.jpg",
                    "isHeroImage": false
                },
                {
                    "altText": null,
                    "height": 768,
                    "width": 1024,
                    "url": "https://cdn.impala.travel/properties/ckn8rjvxm00r60snngobuhve5.jpg",
                    "isHeroImage": false
                },
                {
                    "altText": null,
                    "height": 768,
                    "width": 1024,
                    "url": "https://cdn.impala.travel/properties/ckn8rk57j00rb0snn4xev5k03.jpg",
                    "isHeroImage": false
                },
                {
                    "altText": null,
                    "height": 3201,
                    "width": 2401,
                    "url": "https://cdn.impala.travel/properties/ckn8rkcvc00rd0snnauo3bo3q.jpg",
                    "isHeroImage": false
                },
                {
                    "altText": null,
                    "height": 1200,
                    "width": 1600,
                    "url": "https://cdn.impala.travel/properties/ckn8rkkoy00rf0snn7vps4cey.jpg",
                    "isHeroImage": false
                },
                {
                    "altText": null,
                    "height": 649,
                    "width": 1338,
                    "url": "https://cdn.impala.travel/properties/ckn8rkyfd00rh0snn28g5b6my.jpg",
                    "isHeroImage": false
                },
                {
                    "altText": null,
                    "height": 1512,
                    "width": 2016,
                    "url": "https://cdn.impala.travel/properties/ckn8rl3vi00rj0snnam7r4ty9.jpg",
                    "isHeroImage": false
                },
                {
                    "altText": null,
                    "height": 1536,
                    "width": 2048,
                    "url": "https://cdn.impala.travel/properties/ckn8rlced00rl0snngfibbmud.jpg",
                    "isHeroImage": false
                },
                {
                    "altText": null,
                    "height": 1536,
                    "width": 2048,
                    "url": "https://cdn.impala.travel/properties/ckn8rlk4500ro0snn2wv0epjo.jpg",
                    "isHeroImage": false
                },
                {
                    "altText": null,
                    "height": 1536,
                    "width": 2048,
                    "url": "https://cdn.impala.travel/properties/ckn8rlsm000rq0snnhczkcxmr.jpg",
                    "isHeroImage": false
                },
                {
                    "altText": null,
                    "height": 1536,
                    "width": 2048,
                    "url": "https://cdn.impala.travel/properties/ckn8rlz2700rs0snn2r2d8mx7.jpg",
                    "isHeroImage": false
                },
                {
                    "altText": null,
                    "height": 1536,
                    "width": 2048,
                    "url": "https://cdn.impala.travel/properties/ckn8rm8ab00rt0snn6zki09sk.jpg",
                    "isHeroImage": false
                },
                {
                    "altText": null,
                    "height": 2880,
                    "width": 3840,
                    "url": "https://cdn.impala.travel/properties/ckn8rmi3500ru0snn8fg26ed9.jpg",
                    "isHeroImage": false
                },
                {
                    "altText": null,
                    "height": 2880,
                    "width": 3840,
                    "url": "https://cdn.impala.travel/properties/ckn8rmsvw00rw0snncqcgf18h.jpg",
                    "isHeroImage": false
                },
                {
                    "altText": null,
                    "height": 2880,
                    "width": 3840,
                    "url": "https://cdn.impala.travel/properties/ckn8rn1zp00rz0snnbwtn18kx.jpg",
                    "isHeroImage": false
                },
                {
                    "altText": null,
                    "height": 1536,
                    "width": 2048,
                    "url": "https://cdn.impala.travel/properties/ckn8rnbgp00s10snn46l5h3yr.jpg",
                    "isHeroImage": false
                },
                {
                    "altText": null,
                    "height": 2880,
                    "width": 3840,
                    "url": "https://cdn.impala.travel/properties/ckn8rnmz200s60snn0c2a5n14.jpg",
                    "isHeroImage": false
                },
                {
                    "altText": null,
                    "height": 1536,
                    "width": 2048,
                    "url": "https://cdn.impala.travel/properties/ckn8rp50000sb0snnemakgd6s.jpg",
                    "isHeroImage": false
                }
            ],
            "address": {
                "line1": "53 Main Street",
                "line2": null,
                "city": "Portpatrick ",
                "postalCode": "DG9 8JW",
                "region": null,
                "country": "GBR",
                "countryName": "United Kingdom of Great Britain and Northern Ireland"
            },
            "location": {
                "longitude": -5.1168793,
                "latitude": 54.8419463
            },
            "amenities": [
                {
                    "code": 14,
                    "formatted": "Business library"
                },
                {
                    "code": 50,
                    "formatted": "Housekeeping "
                },
                {
                    "code": 76,
                    "formatted": "Restaurant"
                },
                {
                    "code": 165,
                    "formatted": "Lounges/bars"
                },
                {
                    "code": 186,
                    "formatted": "Street side parking"
                },
                {
                    "code": 239,
                    "formatted": "Beachfront"
                },
                {
                    "code": 242,
                    "formatted": "Heated guest rooms"
                },
                {
                    "code": 198,
                    "formatted": "Non-smoking rooms (generic)"
                }
            ],
            "roomCount": 12,
            "checkIn": {
                "from": "15:00"
            },
            "checkOut": {
                "to": "10:30"
            },
            "termsAndConditions": "",
            "createdAt": "2021-04-08T11:22:17.922Z",
            "updatedAt": "2022-01-24T13:02:16.384Z",
            "externalUrls": [],
            "roomTypes": [
                {
                    "roomTypeId": "a638ac9c-44a7-4c26-a834-115232b9924e",
                    "name": "Apartment - Standard",
                    "description": "Bedding: 1 x Double sofa bed, 1 x Double bed. ",
                    "maxOccupancy": 3,
                    "rates": [],
                    "amenities": [
                        {
                            "code": 251,
                            "formatted": "TV"
                        },
                        {
                            "code": 123,
                            "formatted": "Wireless internet connection"
                        },
                        {
                            "code": 102,
                            "formatted": "Sofa Bed"
                        },
                        {
                            "code": 88,
                            "formatted": "Refrigerator"
                        },
                        {
                            "code": 256,
                            "formatted": "Dining room seats"
                        },
                        {
                            "code": 270,
                            "formatted": "Seating area with sofa/chair"
                        },
                        {
                            "code": 271,
                            "formatted": "Separate toilet area"
                        },
                        {
                            "code": 77,
                            "formatted": "Oven"
                        },
                        {
                            "code": 68,
                            "formatted": "Microwave"
                        },
                        {
                            "code": 11,
                            "formatted": "Bathroom amenities (free toiletries)"
                        },
                        {
                            "code": 28,
                            "formatted": "Desk"
                        },
                        {
                            "code": 50,
                            "formatted": "Hairdryer"
                        },
                        {
                            "code": 59,
                            "formatted": "Kitchen"
                        },
                        {
                            "code": 142,
                            "formatted": "Shower"
                        },
                        {
                            "code": 167,
                            "formatted": "Toaster"
                        },
                        {
                            "code": 163,
                            "formatted": "DVD player"
                        }
                    ],
                    "images": [
                        {
                            "altText": null,
                            "height": 777,
                            "width": 1600,
                            "url": "https://cdn.impala.travel/properties/ckn8ruet800sk0snn2t7bedb0.jpg"
                        },
                        {
                            "altText": null,
                            "height": 777,
                            "width": 1600,
                            "url": "https://cdn.impala.travel/properties/ckn8rtvik00si0snn3thvb8lr.jpg"
                        },
                        {
                            "altText": null,
                            "height": 1856,
                            "width": 3824,
                            "url": "https://cdn.impala.travel/properties/ckn8ru63f00sj0snne8vv3rng.jpg"
                        }
                    ]
                },
                {
                    "roomTypeId": "9a1371bd-8b74-4d9c-bd79-ab71e3030414",
                    "name": "Family Room - Superior",
                    "description": "Bedding: 2 x Single bed, 1 x Double bed.\nGuests: 4 people.",
                    "maxOccupancy": 4,
                    "rates": [],
                    "amenities": [
                        {
                            "code": 55,
                            "formatted": "Iron (ironing facilities)"
                        },
                        {
                            "code": 50,
                            "formatted": "Hairdryer"
                        },
                        {
                            "code": 28,
                            "formatted": "Desk"
                        },
                        {
                            "code": 19,
                            "formatted": "Coffee/Tea maker"
                        },
                        {
                            "code": 11,
                            "formatted": "Bathroom amenities (free toiletries)"
                        },
                        {
                            "code": 251,
                            "formatted": "TV"
                        },
                        {
                            "code": 228,
                            "formatted": "Slippers"
                        },
                        {
                            "code": 123,
                            "formatted": "Wireless internet connection"
                        },
                        {
                            "code": 97,
                            "formatted": "Shower only"
                        },
                        {
                            "code": 85,
                            "formatted": "Private bathroom"
                        }
                    ],
                    "images": [
                        {
                            "altText": null,
                            "height": 777,
                            "width": 1600,
                            "url": "https://cdn.impala.travel/properties/ckn8rw7ar00sm0snn5qul4h0t.jpg"
                        },
                        {
                            "altText": null,
                            "height": 826,
                            "width": 400,
                            "url": "https://cdn.impala.travel/properties/ckn8sf5zb00te0snn9d6qd7g7.jpg"
                        },
                        {
                            "altText": null,
                            "height": 777,
                            "width": 1600,
                            "url": "https://cdn.impala.travel/properties/ckn8rw0on00sl0snn3vqm3ref.jpg"
                        }
                    ]
                },
                {
                    "roomTypeId": "112033c6-411b-4f53-9e14-f7ba5700b869",
                    "name": "Twin Room - Standard",
                    "description": "Bedding: 2 x Single bed.\nGuests: 2 people.",
                    "maxOccupancy": 2,
                    "rates": [],
                    "amenities": [
                        {
                            "code": 50,
                            "formatted": "Hairdryer"
                        },
                        {
                            "code": 28,
                            "formatted": "Desk"
                        },
                        {
                            "code": 19,
                            "formatted": "Coffee/Tea maker"
                        },
                        {
                            "code": 228,
                            "formatted": "Slippers"
                        },
                        {
                            "code": 123,
                            "formatted": "Wireless internet connection"
                        },
                        {
                            "code": 97,
                            "formatted": "Shower only"
                        },
                        {
                            "code": 85,
                            "formatted": "Private bathroom"
                        },
                        {
                            "code": 55,
                            "formatted": "Iron (ironing facilities)"
                        },
                        {
                            "code": 11,
                            "formatted": "Bathroom amenities (free toiletries)"
                        },
                        {
                            "code": 251,
                            "formatted": "TV"
                        }
                    ],
                    "images": [
                        {
                            "altText": null,
                            "height": 400,
                            "width": 824,
                            "url": "https://cdn.impala.travel/properties/ckn8sftcz00tg0snnhvgx6xc3.jpg"
                        },
                        {
                            "altText": null,
                            "height": 777,
                            "width": 1600,
                            "url": "https://cdn.impala.travel/properties/ckn8rx7vs00sr0snn2010di0l.jpg"
                        },
                        {
                            "altText": null,
                            "height": 629,
                            "width": 1296,
                            "url": "https://cdn.impala.travel/properties/ckn8rwze900so0snn5zj8902q.jpg"
                        },
                        {
                            "altText": null,
                            "height": 826,
                            "width": 400,
                            "url": "https://cdn.impala.travel/properties/ckn8sfqjv00tf0snn9v8x0cdz.jpg"
                        }
                    ]
                },
                {
                    "roomTypeId": "ef76546c-330e-4895-a121-a847fa47b887",
                    "name": "Apartment - Superior",
                    "description": "Bedding: 2 x Single bed, 1 x Double sofa bed, 1 x Double bed.\nGuests: 6 people.",
                    "maxOccupancy": 6,
                    "rates": [],
                    "amenities": [
                        {
                            "code": 11,
                            "formatted": "Bathroom amenities (free toiletries)"
                        },
                        {
                            "code": 28,
                            "formatted": "Desk"
                        },
                        {
                            "code": 50,
                            "formatted": "Hairdryer"
                        },
                        {
                            "code": 59,
                            "formatted": "Kitchen"
                        },
                        {
                            "code": 68,
                            "formatted": "Microwave"
                        },
                        {
                            "code": 77,
                            "formatted": "Oven"
                        },
                        {
                            "code": 88,
                            "formatted": "Refrigerator"
                        },
                        {
                            "code": 102,
                            "formatted": "Sofa Bed"
                        },
                        {
                            "code": 123,
                            "formatted": "Wireless internet connection"
                        },
                        {
                            "code": 142,
                            "formatted": "Shower"
                        },
                        {
                            "code": 163,
                            "formatted": "DVD player"
                        },
                        {
                            "code": 167,
                            "formatted": "Toaster"
                        },
                        {
                            "code": 271,
                            "formatted": "Separate toilet area"
                        },
                        {
                            "code": 270,
                            "formatted": "Seating area with sofa/chair"
                        },
                        {
                            "code": 256,
                            "formatted": "Dining room seats"
                        },
                        {
                            "code": 251,
                            "formatted": "TV"
                        }
                    ],
                    "images": [
                        {
                            "altText": null,
                            "height": 777,
                            "width": 1600,
                            "url": "https://cdn.impala.travel/properties/ckn8ryvfb00t00snn6u6w7lpr.jpg"
                        },
                        {
                            "altText": null,
                            "height": 777,
                            "width": 1600,
                            "url": "https://cdn.impala.travel/properties/ckn8rzetf00t20snn1ivwbui1.jpg"
                        },
                        {
                            "altText": null,
                            "height": 1856,
                            "width": 3824,
                            "url": "https://cdn.impala.travel/properties/ckn8rzpy600t30snnhzm50y6l.jpg"
                        },
                        {
                            "altText": null,
                            "height": 777,
                            "width": 1600,
                            "url": "https://cdn.impala.travel/properties/ckn8ryp6v00sz0snnefdia1wx.jpg"
                        },
                        {
                            "altText": null,
                            "height": 777,
                            "width": 1600,
                            "url": "https://cdn.impala.travel/properties/ckn8rygql00sy0snnb6nx7ekx.jpg"
                        },
                        {
                            "altText": null,
                            "height": 629,
                            "width": 1296,
                            "url": "https://cdn.impala.travel/properties/ckn8rz63800t10snn0qxd77r6.jpg"
                        }
                    ]
                },
                {
                    "roomTypeId": "150ff15c-0805-4d30-8833-af630ece67e4",
                    "name": "Double Room - Standard",
                    "description": "Bedding: 1 x Double bed.\nGuests: 2 people.",
                    "maxOccupancy": 2,
                    "rates": [],
                    "amenities": [
                        {
                            "code": 85,
                            "formatted": "Private bathroom"
                        },
                        {
                            "code": 251,
                            "formatted": "TV"
                        },
                        {
                            "code": 228,
                            "formatted": "Slippers"
                        },
                        {
                            "code": 123,
                            "formatted": "Wireless internet connection"
                        },
                        {
                            "code": 97,
                            "formatted": "Shower only"
                        },
                        {
                            "code": 11,
                            "formatted": "Bathroom amenities (free toiletries)"
                        },
                        {
                            "code": 55,
                            "formatted": "Iron (ironing facilities)"
                        },
                        {
                            "code": 50,
                            "formatted": "Hairdryer"
                        },
                        {
                            "code": 28,
                            "formatted": "Desk"
                        },
                        {
                            "code": 19,
                            "formatted": "Coffee/Tea maker"
                        }
                    ],
                    "images": [
                        {
                            "altText": null,
                            "height": 826,
                            "width": 400,
                            "url": "https://cdn.impala.travel/properties/ckn8sgwzt00tj0snn6ua41eib.jpg"
                        },
                        {
                            "altText": null,
                            "height": 777,
                            "width": 1600,
                            "url": "https://cdn.impala.travel/properties/ckn8s0ktg00t70snn9n4o5whm.jpg"
                        },
                        {
                            "altText": null,
                            "height": 777,
                            "width": 1600,
                            "url": "https://cdn.impala.travel/properties/ckn8s0zop00t90snn5ad9fsp4.jpg"
                        },
                        {
                            "altText": null,
                            "height": 777,
                            "width": 1600,
                            "url": "https://cdn.impala.travel/properties/ckn8s0iz600t60snnb9gle5yd.jpg"
                        },
                        {
                            "altText": null,
                            "height": 777,
                            "width": 1600,
                            "url": "https://cdn.impala.travel/properties/ckn8s0rzp00t80snnhuyo47yn.jpg"
                        },
                        {
                            "altText": null,
                            "height": 777,
                            "width": 1600,
                            "url": "https://cdn.impala.travel/properties/ckn8s0h3f00t50snnb5uq1cp2.jpg"
                        }
                    ]
                },
                {
                    "roomTypeId": "9a19bce9-252b-456a-a046-31015999f6c3",
                    "name": "Double Room with Sea View",
                    "description": "Bedding: 1 x King-size bed.\nGuests:\t2 people.",
                    "maxOccupancy": 2,
                    "rates": [],
                    "amenities": [
                        {
                            "code": 123,
                            "formatted": "Wireless internet connection"
                        },
                        {
                            "code": 251,
                            "formatted": "TV"
                        },
                        {
                            "code": 28,
                            "formatted": "Desk"
                        },
                        {
                            "code": 19,
                            "formatted": "Coffee/Tea maker"
                        },
                        {
                            "code": 11,
                            "formatted": "Bathroom amenities (free toiletries)"
                        },
                        {
                            "code": 85,
                            "formatted": "Private bathroom"
                        },
                        {
                            "code": 97,
                            "formatted": "Shower only"
                        },
                        {
                            "code": 50,
                            "formatted": "Hairdryer"
                        },
                        {
                            "code": 55,
                            "formatted": "Iron (ironing facilities)"
                        },
                        {
                            "code": 228,
                            "formatted": "Slippers"
                        }
                    ],
                    "images": [
                        {
                            "altText": null,
                            "height": 777,
                            "width": 1600,
                            "url": "https://cdn.impala.travel/properties/ckn8s1ep100ta0snnekih3u2w.jpg"
                        },
                        {
                            "altText": null,
                            "height": 777,
                            "width": 1600,
                            "url": "https://cdn.impala.travel/properties/ckn8s1ki900tb0snnhg6a3ve3.jpg"
                        }
                    ]
                }
            ]
        },
        {
            "hotelId": "8600bc8b-5c0f-4aae-9bcd-b44cde7bfbce",
            "name": "Waterfront Portpatrick  [SANDBOX]",
            "currency": "GBP",
            "starRating": 3,
            "description": {
                "short": "The Waterfront Hotel is a small quaint hotel with a nautical theme right on the harbour in the beautiful village of Portpatrick, with a large terrace and quaint cozy small lounge, and a bright Bistro restaurant. "
            },
            "phoneNumbers": [
                "+44 0 1776 810800"
            ],
            "contractable": true,
            "emails": [
                "gdapi-staging-hotel+8600bc8b-5c0f-4aae-9bcd-b44cde7bfbce@getimpala.com"
            ],
            "websiteUrl": null,
            "images": [
                {
                    "altText": null,
                    "height": 768,
                    "width": 1024,
                    "url": "https://cdn.impala.travel/properties/ckn8rx2eq00sp0snne3co5f0g.jpg",
                    "isHeroImage": true
                },
                {
                    "altText": null,
                    "height": 2362,
                    "width": 3543,
                    "url": "https://cdn.impala.travel/properties/ckn8rmox600rv0snn7gq90j5w.jpg",
                    "isHeroImage": false
                },
                {
                    "altText": null,
                    "height": 2697,
                    "width": 3024,
                    "url": "https://cdn.impala.travel/properties/ckn8rt30j00sd0snn0e10d43t.jpg",
                    "isHeroImage": false
                },
                {
                    "altText": null,
                    "height": 683,
                    "width": 1024,
                    "url": "https://cdn.impala.travel/properties/ckn8rt8bv00se0snn4v1w5pu1.jpg",
                    "isHeroImage": false
                },
                {
                    "altText": null,
                    "height": 1536,
                    "width": 1024,
                    "url": "https://cdn.impala.travel/properties/ckn8rtcrj00sf0snnej0remhw.jpg",
                    "isHeroImage": false
                },
                {
                    "altText": null,
                    "height": 682,
                    "width": 1024,
                    "url": "https://cdn.impala.travel/properties/ckn8rthta00sg0snnebx6bqop.jpg",
                    "isHeroImage": false
                },
                {
                    "altText": null,
                    "height": 683,
                    "width": 1024,
                    "url": "https://cdn.impala.travel/properties/ckn8rtm0r00sh0snndp9wa6u6.jpg",
                    "isHeroImage": false
                },
                {
                    "altText": null,
                    "height": 683,
                    "width": 1024,
                    "url": "https://cdn.impala.travel/properties/ckn8rwxjg00sn0snnfigr25vy.jpg",
                    "isHeroImage": false
                },
                {
                    "altText": null,
                    "height": 768,
                    "width": 1024,
                    "url": "https://cdn.impala.travel/properties/ckn8rx6uj00sq0snn4qhkgucr.jpg",
                    "isHeroImage": false
                },
                {
                    "altText": null,
                    "height": 1535,
                    "width": 1024,
                    "url": "https://cdn.impala.travel/properties/ckn8rxbuc00ss0snnc4a527o5.jpg",
                    "isHeroImage": false
                },
                {
                    "altText": null,
                    "height": 683,
                    "width": 1024,
                    "url": "https://cdn.impala.travel/properties/ckn8rxggo00st0snnb9cbd4x0.jpg",
                    "isHeroImage": false
                },
                {
                    "altText": null,
                    "height": 683,
                    "width": 1024,
                    "url": "https://cdn.impala.travel/properties/ckn8rxl6g00su0snn8up2exyc.jpg",
                    "isHeroImage": false
                },
                {
                    "altText": null,
                    "height": 768,
                    "width": 1024,
                    "url": "https://cdn.impala.travel/properties/ckn8rxqkz00sv0snnfn123a70.jpg",
                    "isHeroImage": false
                },
                {
                    "altText": null,
                    "height": 988,
                    "width": 1920,
                    "url": "https://cdn.impala.travel/properties/ckn8rxw9y00sw0snnghet80kc.jpg",
                    "isHeroImage": false
                },
                {
                    "altText": null,
                    "height": 547,
                    "width": 1368,
                    "url": "https://cdn.impala.travel/properties/ckn8ry10o00sx0snn6uisf8e5.jpg",
                    "isHeroImage": false
                }
            ],
            "address": {
                "line1": "7 North Crescent Portpatrick ",
                "line2": null,
                "city": "Portpatrick",
                "postalCode": "DG9 8SX",
                "region": null,
                "country": "GBR",
                "countryName": "United Kingdom of Great Britain and Northern Ireland"
            },
            "location": {
                "longitude": -5.1177255,
                "latitude": 54.8422745
            },
            "amenities": [
                {
                    "code": 14,
                    "formatted": "Business library"
                },
                {
                    "code": 50,
                    "formatted": "Housekeeping "
                },
                {
                    "code": 76,
                    "formatted": "Restaurant"
                },
                {
                    "code": 96,
                    "formatted": "Dry cleaning"
                },
                {
                    "code": 116,
                    "formatted": "Accessible parking"
                },
                {
                    "code": 165,
                    "formatted": "Lounges/bars"
                },
                {
                    "code": 168,
                    "formatted": "Onsite laundry"
                },
                {
                    "code": 186,
                    "formatted": "Street side parking"
                },
                {
                    "code": 239,
                    "formatted": "Beachfront"
                },
                {
                    "code": 242,
                    "formatted": "Heated guest rooms"
                },
                {
                    "code": 269,
                    "formatted": "Meeting rooms"
                },
                {
                    "code": 198,
                    "formatted": "Non-smoking rooms (generic)"
                }
            ],
            "roomCount": 15,
            "checkIn": {
                "from": "15:00",
                "to": "20:00"
            },
            "checkOut": {
                "to": "10:30"
            },
            "termsAndConditions": "",
            "createdAt": "2021-04-08T11:13:52.059Z",
            "updatedAt": "2022-01-24T13:02:16.384Z",
            "externalUrls": [],
            "roomTypes": [
                {
                    "roomTypeId": "007b0085-9ac5-4399-856d-bc92bf4f338c",
                    "name": "Family Room",
                    "description": "Family rooms are in the annex, with access to the street and gardens. They have a large double bed, flat-screen TV, tea/coffee maker and electric kettle. Private bathroom.",
                    "maxOccupancy": 3,
                    "rates": [],
                    "amenities": [
                        {
                            "code": 11,
                            "formatted": "Bathroom amenities (free toiletries)"
                        },
                        {
                            "code": 15,
                            "formatted": "Bath or Shower"
                        },
                        {
                            "code": 50,
                            "formatted": "Hairdryer"
                        },
                        {
                            "code": 102,
                            "formatted": "Sofa Bed"
                        },
                        {
                            "code": 3,
                            "formatted": "Alarm clock"
                        },
                        {
                            "code": 123,
                            "formatted": "Wireless internet connection"
                        },
                        {
                            "code": 251,
                            "formatted": "TV"
                        },
                        {
                            "code": 271,
                            "formatted": "Separate toilet area"
                        }
                    ],
                    "images": [
                        {
                            "altText": null,
                            "height": 3840,
                            "width": 2880,
                            "url": "https://cdn.impala.travel/properties/ckn8rzrvk00t40snn5p8rbul4.jpg"
                        },
                        {
                            "altText": null,
                            "height": 900,
                            "width": 1200,
                            "url": "https://cdn.impala.travel/properties/ckn8r4zmd00qk0snngfgb1d0h.jpg"
                        },
                        {
                            "altText": null,
                            "height": 855,
                            "width": 1280,
                            "url": "https://cdn.impala.travel/properties/ckn8r4hw800qi0snngzqs0u0s.jpg"
                        },
                        {
                            "altText": null,
                            "height": 768,
                            "width": 1024,
                            "url": "https://cdn.impala.travel/properties/ckn8r4qw400qj0snn22kz35p0.jpg"
                        }
                    ]
                },
                {
                    "roomTypeId": "2bd516c2-a45b-4664-8e96-b5f40a91c503",
                    "name": "Sea View Double Room",
                    "description": "Sea view double rooms have one extra-large double bed, flat-screen TV, kettle and tea/coffee maker. Small Private bathroom.",
                    "maxOccupancy": 2,
                    "rates": [],
                    "amenities": [
                        {
                            "code": 271,
                            "formatted": "Separate toilet area"
                        },
                        {
                            "code": 3,
                            "formatted": "Alarm clock"
                        },
                        {
                            "code": 11,
                            "formatted": "Bathroom amenities (free toiletries)"
                        },
                        {
                            "code": 15,
                            "formatted": "Bath or Shower"
                        },
                        {
                            "code": 28,
                            "formatted": "Desk"
                        },
                        {
                            "code": 50,
                            "formatted": "Hairdryer"
                        },
                        {
                            "code": 123,
                            "formatted": "Wireless internet connection"
                        },
                        {
                            "code": 251,
                            "formatted": "TV"
                        },
                        {
                            "code": 270,
                            "formatted": "Seating area with sofa/chair"
                        }
                    ],
                    "images": [
                        {
                            "altText": null,
                            "height": 2362,
                            "width": 3543,
                            "url": "https://cdn.impala.travel/properties/ckn8r78ck00qn0snn0xtncnmm.jpg"
                        },
                        {
                            "altText": null,
                            "height": 2880,
                            "width": 3840,
                            "url": "https://cdn.impala.travel/properties/ckn8r6rhx00ql0snn91jscov9.jpg"
                        },
                        {
                            "altText": null,
                            "height": 2362,
                            "width": 3543,
                            "url": "https://cdn.impala.travel/properties/ckn8r6zuo00qm0snnayetbj3o.jpg"
                        },
                        {
                            "altText": null,
                            "height": 3543,
                            "width": 2390,
                            "url": "https://cdn.impala.travel/properties/ckn8r7hib00qo0snn1b9z00wb.jpg"
                        },
                        {
                            "altText": null,
                            "height": 3840,
                            "width": 2880,
                            "url": "https://cdn.impala.travel/properties/ckn8r8c1n00qp0snn7fwb1mzi.jpg"
                        },
                        {
                            "altText": null,
                            "height": 853,
                            "width": 1280,
                            "url": "https://cdn.impala.travel/properties/ckn8r94na00qq0snnfm2yflfv.jpg"
                        }
                    ]
                },
                {
                    "roomTypeId": "631c0f45-bc08-4118-93fa-2200f14032a2",
                    "name": "Double Room",
                    "description": "Double rooms at Waterfront Hotel feature a double bed, flat-screen TV, tea/coffee maker and electric kettle. Small Private bathroom.",
                    "maxOccupancy": 2,
                    "rates": [],
                    "amenities": [
                        {
                            "code": 123,
                            "formatted": "Wireless internet connection"
                        },
                        {
                            "code": 50,
                            "formatted": "Hairdryer"
                        },
                        {
                            "code": 28,
                            "formatted": "Desk"
                        },
                        {
                            "code": 15,
                            "formatted": "Bath or Shower"
                        },
                        {
                            "code": 11,
                            "formatted": "Bathroom amenities (free toiletries)"
                        },
                        {
                            "code": 3,
                            "formatted": "Alarm clock"
                        },
                        {
                            "code": 271,
                            "formatted": "Separate toilet area"
                        },
                        {
                            "code": 251,
                            "formatted": "TV"
                        }
                    ],
                    "images": [
                        {
                            "altText": null,
                            "height": 768,
                            "width": 1024,
                            "url": "https://cdn.impala.travel/properties/ckn8rc9p500qv0snn4hkpcofm.jpg"
                        },
                        {
                            "altText": null,
                            "height": 2880,
                            "width": 3840,
                            "url": "https://cdn.impala.travel/properties/ckn8rbuy300qu0snn96vrbbmt.jpg"
                        },
                        {
                            "altText": null,
                            "height": 2362,
                            "width": 3543,
                            "url": "https://cdn.impala.travel/properties/ckn8rbaao00qt0snndhfed1qe.jpg"
                        },
                        {
                            "altText": null,
                            "height": 768,
                            "width": 1024,
                            "url": "https://cdn.impala.travel/properties/ckn8raemn00qs0snna3o87150.jpg"
                        },
                        {
                            "altText": null,
                            "height": 2367,
                            "width": 3543,
                            "url": "https://cdn.impala.travel/properties/ckn8ra71s00qr0snn1ppvaurs.jpg"
                        }
                    ]
                },
                {
                    "roomTypeId": "d271436d-cbe5-454e-9f37-dd992acae095",
                    "name": "Twin Room",
                    "description": "The twin room features two single beds, flat-screen TV, electric kettle and tea/coffee maker. Small Private bathroom.",
                    "maxOccupancy": 2,
                    "rates": [],
                    "amenities": [
                        {
                            "code": 11,
                            "formatted": "Bathroom amenities (free toiletries)"
                        },
                        {
                            "code": 15,
                            "formatted": "Bath or Shower"
                        },
                        {
                            "code": 123,
                            "formatted": "Wireless internet connection"
                        },
                        {
                            "code": 271,
                            "formatted": "Separate toilet area"
                        },
                        {
                            "code": 270,
                            "formatted": "Seating area with sofa/chair"
                        },
                        {
                            "code": 251,
                            "formatted": "TV"
                        },
                        {
                            "code": 3,
                            "formatted": "Alarm clock"
                        },
                        {
                            "code": 28,
                            "formatted": "Desk"
                        },
                        {
                            "code": 50,
                            "formatted": "Hairdryer"
                        }
                    ],
                    "images": [
                        {
                            "altText": null,
                            "height": 3840,
                            "width": 2880,
                            "url": "https://cdn.impala.travel/properties/ckn8redko00qy0snn9cngdfbu.jpg"
                        },
                        {
                            "altText": null,
                            "height": 2356,
                            "width": 3543,
                            "url": "https://cdn.impala.travel/properties/ckn8rdd5000qw0snndkln67ds.jpg"
                        },
                        {
                            "altText": null,
                            "height": 853,
                            "width": 1280,
                            "url": "https://cdn.impala.travel/properties/ckn8rdy4z00qx0snnaak5hubr.jpg"
                        },
                        {
                            "altText": null,
                            "height": 3840,
                            "width": 2880,
                            "url": "https://cdn.impala.travel/properties/ckn8rf4zy00qz0snn4gd45w9e.jpg"
                        }
                    ]
                }
            ]
        }]
    }
};
const mockHotels = [{
    "hotelId": "2196c8c9-bc59-4f0f-81bf-3b1e59dfe215",
    "name": "Harbour House Hotel [SANDBOX]",
    "currency": "GBP",
    "starRating": 3,
    "description": {
        "short": "The Harbour House Hotel, and Anglesea Apartments is located in the picturesque seaside village of Portpatrick, Dumfries and Galloway. Settled in south west Scotland with views over the Irish Sea, the hotel has a seafront terraced restauran  as well as a cosy lounge and bar area."
    },
    "phoneNumbers": [
        "01776 810456"
    ],
    "contractable": true,
    "emails": [
        "gdapi-staging-hotel+2196c8c9-bc59-4f0f-81bf-3b1e59dfe215@getimpala.com"
    ],
    "websiteUrl": null,
    "images": [
        {
            "altText": null,
            "height": 777,
            "width": 1600,
            "url": "https://cdn.impala.travel/properties/ckn8rkt4100rg0snn5uoe6ev4.jpg",
            "isHeroImage": true
        },
        {
            "altText": null,
            "height": 768,
            "width": 1024,
            "url": "https://cdn.impala.travel/properties/ckn8rjp0g00r30snnainlafdm.jpg",
            "isHeroImage": false
        },
        {
            "altText": null,
            "height": 768,
            "width": 1024,
            "url": "https://cdn.impala.travel/properties/ckn8rjvxm00r60snngobuhve5.jpg",
            "isHeroImage": false
        },
        {
            "altText": null,
            "height": 768,
            "width": 1024,
            "url": "https://cdn.impala.travel/properties/ckn8rk57j00rb0snn4xev5k03.jpg",
            "isHeroImage": false
        },
        {
            "altText": null,
            "height": 3201,
            "width": 2401,
            "url": "https://cdn.impala.travel/properties/ckn8rkcvc00rd0snnauo3bo3q.jpg",
            "isHeroImage": false
        },
        {
            "altText": null,
            "height": 1200,
            "width": 1600,
            "url": "https://cdn.impala.travel/properties/ckn8rkkoy00rf0snn7vps4cey.jpg",
            "isHeroImage": false
        },
        {
            "altText": null,
            "height": 649,
            "width": 1338,
            "url": "https://cdn.impala.travel/properties/ckn8rkyfd00rh0snn28g5b6my.jpg",
            "isHeroImage": false
        },
        {
            "altText": null,
            "height": 1512,
            "width": 2016,
            "url": "https://cdn.impala.travel/properties/ckn8rl3vi00rj0snnam7r4ty9.jpg",
            "isHeroImage": false
        },
        {
            "altText": null,
            "height": 1536,
            "width": 2048,
            "url": "https://cdn.impala.travel/properties/ckn8rlced00rl0snngfibbmud.jpg",
            "isHeroImage": false
        },
        {
            "altText": null,
            "height": 1536,
            "width": 2048,
            "url": "https://cdn.impala.travel/properties/ckn8rlk4500ro0snn2wv0epjo.jpg",
            "isHeroImage": false
        },
        {
            "altText": null,
            "height": 1536,
            "width": 2048,
            "url": "https://cdn.impala.travel/properties/ckn8rlsm000rq0snnhczkcxmr.jpg",
            "isHeroImage": false
        },
        {
            "altText": null,
            "height": 1536,
            "width": 2048,
            "url": "https://cdn.impala.travel/properties/ckn8rlz2700rs0snn2r2d8mx7.jpg",
            "isHeroImage": false
        },
        {
            "altText": null,
            "height": 1536,
            "width": 2048,
            "url": "https://cdn.impala.travel/properties/ckn8rm8ab00rt0snn6zki09sk.jpg",
            "isHeroImage": false
        },
        {
            "altText": null,
            "height": 2880,
            "width": 3840,
            "url": "https://cdn.impala.travel/properties/ckn8rmi3500ru0snn8fg26ed9.jpg",
            "isHeroImage": false
        },
        {
            "altText": null,
            "height": 2880,
            "width": 3840,
            "url": "https://cdn.impala.travel/properties/ckn8rmsvw00rw0snncqcgf18h.jpg",
            "isHeroImage": false
        },
        {
            "altText": null,
            "height": 2880,
            "width": 3840,
            "url": "https://cdn.impala.travel/properties/ckn8rn1zp00rz0snnbwtn18kx.jpg",
            "isHeroImage": false
        },
        {
            "altText": null,
            "height": 1536,
            "width": 2048,
            "url": "https://cdn.impala.travel/properties/ckn8rnbgp00s10snn46l5h3yr.jpg",
            "isHeroImage": false
        },
        {
            "altText": null,
            "height": 2880,
            "width": 3840,
            "url": "https://cdn.impala.travel/properties/ckn8rnmz200s60snn0c2a5n14.jpg",
            "isHeroImage": false
        },
        {
            "altText": null,
            "height": 1536,
            "width": 2048,
            "url": "https://cdn.impala.travel/properties/ckn8rp50000sb0snnemakgd6s.jpg",
            "isHeroImage": false
        }
    ],
    "address": {
        "line1": "53 Main Street",
        "line2": null,
        "city": "Portpatrick ",
        "postalCode": "DG9 8JW",
        "region": null,
        "country": "GBR",
        "countryName": "United Kingdom of Great Britain and Northern Ireland"
    },
    "location": {
        "longitude": -5.1168793,
        "latitude": 54.8419463
    },
    "amenities": [
        {
            "code": 14,
            "formatted": "Business library"
        },
        {
            "code": 50,
            "formatted": "Housekeeping "
        },
        {
            "code": 76,
            "formatted": "Restaurant"
        },
        {
            "code": 165,
            "formatted": "Lounges/bars"
        },
        {
            "code": 186,
            "formatted": "Street side parking"
        },
        {
            "code": 239,
            "formatted": "Beachfront"
        },
        {
            "code": 242,
            "formatted": "Heated guest rooms"
        },
        {
            "code": 198,
            "formatted": "Non-smoking rooms (generic)"
        }
    ],
    "roomCount": 12,
    "checkIn": {
        "from": "15:00"
    },
    "checkOut": {
        "to": "10:30"
    },
    "termsAndConditions": "",
    "createdAt": "2021-04-08T11:22:17.922Z",
    "updatedAt": "2022-01-24T13:02:16.384Z",
    "externalUrls": [],
    "roomTypes": [
        {
            "roomTypeId": "a638ac9c-44a7-4c26-a834-115232b9924e",
            "name": "Apartment - Standard",
            "description": "Bedding: 1 x Double sofa bed, 1 x Double bed. ",
            "maxOccupancy": 3,
            "rates": [],
            "amenities": [
                {
                    "code": 251,
                    "formatted": "TV"
                },
                {
                    "code": 123,
                    "formatted": "Wireless internet connection"
                },
                {
                    "code": 102,
                    "formatted": "Sofa Bed"
                },
                {
                    "code": 88,
                    "formatted": "Refrigerator"
                },
                {
                    "code": 256,
                    "formatted": "Dining room seats"
                },
                {
                    "code": 270,
                    "formatted": "Seating area with sofa/chair"
                },
                {
                    "code": 271,
                    "formatted": "Separate toilet area"
                },
                {
                    "code": 77,
                    "formatted": "Oven"
                },
                {
                    "code": 68,
                    "formatted": "Microwave"
                },
                {
                    "code": 11,
                    "formatted": "Bathroom amenities (free toiletries)"
                },
                {
                    "code": 28,
                    "formatted": "Desk"
                },
                {
                    "code": 50,
                    "formatted": "Hairdryer"
                },
                {
                    "code": 59,
                    "formatted": "Kitchen"
                },
                {
                    "code": 142,
                    "formatted": "Shower"
                },
                {
                    "code": 167,
                    "formatted": "Toaster"
                },
                {
                    "code": 163,
                    "formatted": "DVD player"
                }
            ],
            "images": [
                {
                    "altText": null,
                    "height": 777,
                    "width": 1600,
                    "url": "https://cdn.impala.travel/properties/ckn8ruet800sk0snn2t7bedb0.jpg"
                },
                {
                    "altText": null,
                    "height": 777,
                    "width": 1600,
                    "url": "https://cdn.impala.travel/properties/ckn8rtvik00si0snn3thvb8lr.jpg"
                },
                {
                    "altText": null,
                    "height": 1856,
                    "width": 3824,
                    "url": "https://cdn.impala.travel/properties/ckn8ru63f00sj0snne8vv3rng.jpg"
                }
            ]
        },
        {
            "roomTypeId": "9a1371bd-8b74-4d9c-bd79-ab71e3030414",
            "name": "Family Room - Superior",
            "description": "Bedding: 2 x Single bed, 1 x Double bed.\nGuests: 4 people.",
            "maxOccupancy": 4,
            "rates": [],
            "amenities": [
                {
                    "code": 55,
                    "formatted": "Iron (ironing facilities)"
                },
                {
                    "code": 50,
                    "formatted": "Hairdryer"
                },
                {
                    "code": 28,
                    "formatted": "Desk"
                },
                {
                    "code": 19,
                    "formatted": "Coffee/Tea maker"
                },
                {
                    "code": 11,
                    "formatted": "Bathroom amenities (free toiletries)"
                },
                {
                    "code": 251,
                    "formatted": "TV"
                },
                {
                    "code": 228,
                    "formatted": "Slippers"
                },
                {
                    "code": 123,
                    "formatted": "Wireless internet connection"
                },
                {
                    "code": 97,
                    "formatted": "Shower only"
                },
                {
                    "code": 85,
                    "formatted": "Private bathroom"
                }
            ],
            "images": [
                {
                    "altText": null,
                    "height": 777,
                    "width": 1600,
                    "url": "https://cdn.impala.travel/properties/ckn8rw7ar00sm0snn5qul4h0t.jpg"
                },
                {
                    "altText": null,
                    "height": 826,
                    "width": 400,
                    "url": "https://cdn.impala.travel/properties/ckn8sf5zb00te0snn9d6qd7g7.jpg"
                },
                {
                    "altText": null,
                    "height": 777,
                    "width": 1600,
                    "url": "https://cdn.impala.travel/properties/ckn8rw0on00sl0snn3vqm3ref.jpg"
                }
            ]
        },
        {
            "roomTypeId": "112033c6-411b-4f53-9e14-f7ba5700b869",
            "name": "Twin Room - Standard",
            "description": "Bedding: 2 x Single bed.\nGuests: 2 people.",
            "maxOccupancy": 2,
            "rates": [],
            "amenities": [
                {
                    "code": 50,
                    "formatted": "Hairdryer"
                },
                {
                    "code": 28,
                    "formatted": "Desk"
                },
                {
                    "code": 19,
                    "formatted": "Coffee/Tea maker"
                },
                {
                    "code": 228,
                    "formatted": "Slippers"
                },
                {
                    "code": 123,
                    "formatted": "Wireless internet connection"
                },
                {
                    "code": 97,
                    "formatted": "Shower only"
                },
                {
                    "code": 85,
                    "formatted": "Private bathroom"
                },
                {
                    "code": 55,
                    "formatted": "Iron (ironing facilities)"
                },
                {
                    "code": 11,
                    "formatted": "Bathroom amenities (free toiletries)"
                },
                {
                    "code": 251,
                    "formatted": "TV"
                }
            ],
            "images": [
                {
                    "altText": null,
                    "height": 400,
                    "width": 824,
                    "url": "https://cdn.impala.travel/properties/ckn8sftcz00tg0snnhvgx6xc3.jpg"
                },
                {
                    "altText": null,
                    "height": 777,
                    "width": 1600,
                    "url": "https://cdn.impala.travel/properties/ckn8rx7vs00sr0snn2010di0l.jpg"
                },
                {
                    "altText": null,
                    "height": 629,
                    "width": 1296,
                    "url": "https://cdn.impala.travel/properties/ckn8rwze900so0snn5zj8902q.jpg"
                },
                {
                    "altText": null,
                    "height": 826,
                    "width": 400,
                    "url": "https://cdn.impala.travel/properties/ckn8sfqjv00tf0snn9v8x0cdz.jpg"
                }
            ]
        },
        {
            "roomTypeId": "ef76546c-330e-4895-a121-a847fa47b887",
            "name": "Apartment - Superior",
            "description": "Bedding: 2 x Single bed, 1 x Double sofa bed, 1 x Double bed.\nGuests: 6 people.",
            "maxOccupancy": 6,
            "rates": [],
            "amenities": [
                {
                    "code": 11,
                    "formatted": "Bathroom amenities (free toiletries)"
                },
                {
                    "code": 28,
                    "formatted": "Desk"
                },
                {
                    "code": 50,
                    "formatted": "Hairdryer"
                },
                {
                    "code": 59,
                    "formatted": "Kitchen"
                },
                {
                    "code": 68,
                    "formatted": "Microwave"
                },
                {
                    "code": 77,
                    "formatted": "Oven"
                },
                {
                    "code": 88,
                    "formatted": "Refrigerator"
                },
                {
                    "code": 102,
                    "formatted": "Sofa Bed"
                },
                {
                    "code": 123,
                    "formatted": "Wireless internet connection"
                },
                {
                    "code": 142,
                    "formatted": "Shower"
                },
                {
                    "code": 163,
                    "formatted": "DVD player"
                },
                {
                    "code": 167,
                    "formatted": "Toaster"
                },
                {
                    "code": 271,
                    "formatted": "Separate toilet area"
                },
                {
                    "code": 270,
                    "formatted": "Seating area with sofa/chair"
                },
                {
                    "code": 256,
                    "formatted": "Dining room seats"
                },
                {
                    "code": 251,
                    "formatted": "TV"
                }
            ],
            "images": [
                {
                    "altText": null,
                    "height": 777,
                    "width": 1600,
                    "url": "https://cdn.impala.travel/properties/ckn8ryvfb00t00snn6u6w7lpr.jpg"
                },
                {
                    "altText": null,
                    "height": 777,
                    "width": 1600,
                    "url": "https://cdn.impala.travel/properties/ckn8rzetf00t20snn1ivwbui1.jpg"
                },
                {
                    "altText": null,
                    "height": 1856,
                    "width": 3824,
                    "url": "https://cdn.impala.travel/properties/ckn8rzpy600t30snnhzm50y6l.jpg"
                },
                {
                    "altText": null,
                    "height": 777,
                    "width": 1600,
                    "url": "https://cdn.impala.travel/properties/ckn8ryp6v00sz0snnefdia1wx.jpg"
                },
                {
                    "altText": null,
                    "height": 777,
                    "width": 1600,
                    "url": "https://cdn.impala.travel/properties/ckn8rygql00sy0snnb6nx7ekx.jpg"
                },
                {
                    "altText": null,
                    "height": 629,
                    "width": 1296,
                    "url": "https://cdn.impala.travel/properties/ckn8rz63800t10snn0qxd77r6.jpg"
                }
            ]
        },
        {
            "roomTypeId": "150ff15c-0805-4d30-8833-af630ece67e4",
            "name": "Double Room - Standard",
            "description": "Bedding: 1 x Double bed.\nGuests: 2 people.",
            "maxOccupancy": 2,
            "rates": [],
            "amenities": [
                {
                    "code": 85,
                    "formatted": "Private bathroom"
                },
                {
                    "code": 251,
                    "formatted": "TV"
                },
                {
                    "code": 228,
                    "formatted": "Slippers"
                },
                {
                    "code": 123,
                    "formatted": "Wireless internet connection"
                },
                {
                    "code": 97,
                    "formatted": "Shower only"
                },
                {
                    "code": 11,
                    "formatted": "Bathroom amenities (free toiletries)"
                },
                {
                    "code": 55,
                    "formatted": "Iron (ironing facilities)"
                },
                {
                    "code": 50,
                    "formatted": "Hairdryer"
                },
                {
                    "code": 28,
                    "formatted": "Desk"
                },
                {
                    "code": 19,
                    "formatted": "Coffee/Tea maker"
                }
            ],
            "images": [
                {
                    "altText": null,
                    "height": 826,
                    "width": 400,
                    "url": "https://cdn.impala.travel/properties/ckn8sgwzt00tj0snn6ua41eib.jpg"
                },
                {
                    "altText": null,
                    "height": 777,
                    "width": 1600,
                    "url": "https://cdn.impala.travel/properties/ckn8s0ktg00t70snn9n4o5whm.jpg"
                },
                {
                    "altText": null,
                    "height": 777,
                    "width": 1600,
                    "url": "https://cdn.impala.travel/properties/ckn8s0zop00t90snn5ad9fsp4.jpg"
                },
                {
                    "altText": null,
                    "height": 777,
                    "width": 1600,
                    "url": "https://cdn.impala.travel/properties/ckn8s0iz600t60snnb9gle5yd.jpg"
                },
                {
                    "altText": null,
                    "height": 777,
                    "width": 1600,
                    "url": "https://cdn.impala.travel/properties/ckn8s0rzp00t80snnhuyo47yn.jpg"
                },
                {
                    "altText": null,
                    "height": 777,
                    "width": 1600,
                    "url": "https://cdn.impala.travel/properties/ckn8s0h3f00t50snnb5uq1cp2.jpg"
                }
            ]
        },
        {
            "roomTypeId": "9a19bce9-252b-456a-a046-31015999f6c3",
            "name": "Double Room with Sea View",
            "description": "Bedding: 1 x King-size bed.\nGuests:\t2 people.",
            "maxOccupancy": 2,
            "rates": [],
            "amenities": [
                {
                    "code": 123,
                    "formatted": "Wireless internet connection"
                },
                {
                    "code": 251,
                    "formatted": "TV"
                },
                {
                    "code": 28,
                    "formatted": "Desk"
                },
                {
                    "code": 19,
                    "formatted": "Coffee/Tea maker"
                },
                {
                    "code": 11,
                    "formatted": "Bathroom amenities (free toiletries)"
                },
                {
                    "code": 85,
                    "formatted": "Private bathroom"
                },
                {
                    "code": 97,
                    "formatted": "Shower only"
                },
                {
                    "code": 50,
                    "formatted": "Hairdryer"
                },
                {
                    "code": 55,
                    "formatted": "Iron (ironing facilities)"
                },
                {
                    "code": 228,
                    "formatted": "Slippers"
                }
            ],
            "images": [
                {
                    "altText": null,
                    "height": 777,
                    "width": 1600,
                    "url": "https://cdn.impala.travel/properties/ckn8s1ep100ta0snnekih3u2w.jpg"
                },
                {
                    "altText": null,
                    "height": 777,
                    "width": 1600,
                    "url": "https://cdn.impala.travel/properties/ckn8s1ki900tb0snnhg6a3ve3.jpg"
                }
            ]
        }
    ]
},
{
    "hotelId": "8600bc8b-5c0f-4aae-9bcd-b44cde7bfbce",
    "name": "Waterfront Portpatrick  [SANDBOX]",
    "currency": "GBP",
    "starRating": 3,
    "description": {
        "short": "The Waterfront Hotel is a small quaint hotel with a nautical theme right on the harbour in the beautiful village of Portpatrick, with a large terrace and quaint cozy small lounge, and a bright Bistro restaurant. "
    },
    "phoneNumbers": [
        "+44 0 1776 810800"
    ],
    "contractable": true,
    "emails": [
        "gdapi-staging-hotel+8600bc8b-5c0f-4aae-9bcd-b44cde7bfbce@getimpala.com"
    ],
    "websiteUrl": null,
    "images": [
        {
            "altText": null,
            "height": 768,
            "width": 1024,
            "url": "https://cdn.impala.travel/properties/ckn8rx2eq00sp0snne3co5f0g.jpg",
            "isHeroImage": true
        },
        {
            "altText": null,
            "height": 2362,
            "width": 3543,
            "url": "https://cdn.impala.travel/properties/ckn8rmox600rv0snn7gq90j5w.jpg",
            "isHeroImage": false
        },
        {
            "altText": null,
            "height": 2697,
            "width": 3024,
            "url": "https://cdn.impala.travel/properties/ckn8rt30j00sd0snn0e10d43t.jpg",
            "isHeroImage": false
        },
        {
            "altText": null,
            "height": 683,
            "width": 1024,
            "url": "https://cdn.impala.travel/properties/ckn8rt8bv00se0snn4v1w5pu1.jpg",
            "isHeroImage": false
        },
        {
            "altText": null,
            "height": 1536,
            "width": 1024,
            "url": "https://cdn.impala.travel/properties/ckn8rtcrj00sf0snnej0remhw.jpg",
            "isHeroImage": false
        },
        {
            "altText": null,
            "height": 682,
            "width": 1024,
            "url": "https://cdn.impala.travel/properties/ckn8rthta00sg0snnebx6bqop.jpg",
            "isHeroImage": false
        },
        {
            "altText": null,
            "height": 683,
            "width": 1024,
            "url": "https://cdn.impala.travel/properties/ckn8rtm0r00sh0snndp9wa6u6.jpg",
            "isHeroImage": false
        },
        {
            "altText": null,
            "height": 683,
            "width": 1024,
            "url": "https://cdn.impala.travel/properties/ckn8rwxjg00sn0snnfigr25vy.jpg",
            "isHeroImage": false
        },
        {
            "altText": null,
            "height": 768,
            "width": 1024,
            "url": "https://cdn.impala.travel/properties/ckn8rx6uj00sq0snn4qhkgucr.jpg",
            "isHeroImage": false
        },
        {
            "altText": null,
            "height": 1535,
            "width": 1024,
            "url": "https://cdn.impala.travel/properties/ckn8rxbuc00ss0snnc4a527o5.jpg",
            "isHeroImage": false
        },
        {
            "altText": null,
            "height": 683,
            "width": 1024,
            "url": "https://cdn.impala.travel/properties/ckn8rxggo00st0snnb9cbd4x0.jpg",
            "isHeroImage": false
        },
        {
            "altText": null,
            "height": 683,
            "width": 1024,
            "url": "https://cdn.impala.travel/properties/ckn8rxl6g00su0snn8up2exyc.jpg",
            "isHeroImage": false
        },
        {
            "altText": null,
            "height": 768,
            "width": 1024,
            "url": "https://cdn.impala.travel/properties/ckn8rxqkz00sv0snnfn123a70.jpg",
            "isHeroImage": false
        },
        {
            "altText": null,
            "height": 988,
            "width": 1920,
            "url": "https://cdn.impala.travel/properties/ckn8rxw9y00sw0snnghet80kc.jpg",
            "isHeroImage": false
        },
        {
            "altText": null,
            "height": 547,
            "width": 1368,
            "url": "https://cdn.impala.travel/properties/ckn8ry10o00sx0snn6uisf8e5.jpg",
            "isHeroImage": false
        }
    ],
    "address": {
        "line1": "7 North Crescent Portpatrick ",
        "line2": null,
        "city": "Portpatrick",
        "postalCode": "DG9 8SX",
        "region": null,
        "country": "GBR",
        "countryName": "United Kingdom of Great Britain and Northern Ireland"
    },
    "location": {
        "longitude": -5.1177255,
        "latitude": 54.8422745
    },
    "amenities": [
        {
            "code": 14,
            "formatted": "Business library"
        },
        {
            "code": 50,
            "formatted": "Housekeeping "
        },
        {
            "code": 76,
            "formatted": "Restaurant"
        },
        {
            "code": 96,
            "formatted": "Dry cleaning"
        },
        {
            "code": 116,
            "formatted": "Accessible parking"
        },
        {
            "code": 165,
            "formatted": "Lounges/bars"
        },
        {
            "code": 168,
            "formatted": "Onsite laundry"
        },
        {
            "code": 186,
            "formatted": "Street side parking"
        },
        {
            "code": 239,
            "formatted": "Beachfront"
        },
        {
            "code": 242,
            "formatted": "Heated guest rooms"
        },
        {
            "code": 269,
            "formatted": "Meeting rooms"
        },
        {
            "code": 198,
            "formatted": "Non-smoking rooms (generic)"
        }
    ],
    "roomCount": 15,
    "checkIn": {
        "from": "15:00",
        "to": "20:00"
    },
    "checkOut": {
        "to": "10:30"
    },
    "termsAndConditions": "",
    "createdAt": "2021-04-08T11:13:52.059Z",
    "updatedAt": "2022-01-24T13:02:16.384Z",
    "externalUrls": [],
    "roomTypes": [
        {
            "roomTypeId": "007b0085-9ac5-4399-856d-bc92bf4f338c",
            "name": "Family Room",
            "description": "Family rooms are in the annex, with access to the street and gardens. They have a large double bed, flat-screen TV, tea/coffee maker and electric kettle. Private bathroom.",
            "maxOccupancy": 3,
            "rates": [],
            "amenities": [
                {
                    "code": 11,
                    "formatted": "Bathroom amenities (free toiletries)"
                },
                {
                    "code": 15,
                    "formatted": "Bath or Shower"
                },
                {
                    "code": 50,
                    "formatted": "Hairdryer"
                },
                {
                    "code": 102,
                    "formatted": "Sofa Bed"
                },
                {
                    "code": 3,
                    "formatted": "Alarm clock"
                },
                {
                    "code": 123,
                    "formatted": "Wireless internet connection"
                },
                {
                    "code": 251,
                    "formatted": "TV"
                },
                {
                    "code": 271,
                    "formatted": "Separate toilet area"
                }
            ],
            "images": [
                {
                    "altText": null,
                    "height": 3840,
                    "width": 2880,
                    "url": "https://cdn.impala.travel/properties/ckn8rzrvk00t40snn5p8rbul4.jpg"
                },
                {
                    "altText": null,
                    "height": 900,
                    "width": 1200,
                    "url": "https://cdn.impala.travel/properties/ckn8r4zmd00qk0snngfgb1d0h.jpg"
                },
                {
                    "altText": null,
                    "height": 855,
                    "width": 1280,
                    "url": "https://cdn.impala.travel/properties/ckn8r4hw800qi0snngzqs0u0s.jpg"
                },
                {
                    "altText": null,
                    "height": 768,
                    "width": 1024,
                    "url": "https://cdn.impala.travel/properties/ckn8r4qw400qj0snn22kz35p0.jpg"
                }
            ]
        },
        {
            "roomTypeId": "2bd516c2-a45b-4664-8e96-b5f40a91c503",
            "name": "Sea View Double Room",
            "description": "Sea view double rooms have one extra-large double bed, flat-screen TV, kettle and tea/coffee maker. Small Private bathroom.",
            "maxOccupancy": 2,
            "rates": [],
            "amenities": [
                {
                    "code": 271,
                    "formatted": "Separate toilet area"
                },
                {
                    "code": 3,
                    "formatted": "Alarm clock"
                },
                {
                    "code": 11,
                    "formatted": "Bathroom amenities (free toiletries)"
                },
                {
                    "code": 15,
                    "formatted": "Bath or Shower"
                },
                {
                    "code": 28,
                    "formatted": "Desk"
                },
                {
                    "code": 50,
                    "formatted": "Hairdryer"
                },
                {
                    "code": 123,
                    "formatted": "Wireless internet connection"
                },
                {
                    "code": 251,
                    "formatted": "TV"
                },
                {
                    "code": 270,
                    "formatted": "Seating area with sofa/chair"
                }
            ],
            "images": [
                {
                    "altText": null,
                    "height": 2362,
                    "width": 3543,
                    "url": "https://cdn.impala.travel/properties/ckn8r78ck00qn0snn0xtncnmm.jpg"
                },
                {
                    "altText": null,
                    "height": 2880,
                    "width": 3840,
                    "url": "https://cdn.impala.travel/properties/ckn8r6rhx00ql0snn91jscov9.jpg"
                },
                {
                    "altText": null,
                    "height": 2362,
                    "width": 3543,
                    "url": "https://cdn.impala.travel/properties/ckn8r6zuo00qm0snnayetbj3o.jpg"
                },
                {
                    "altText": null,
                    "height": 3543,
                    "width": 2390,
                    "url": "https://cdn.impala.travel/properties/ckn8r7hib00qo0snn1b9z00wb.jpg"
                },
                {
                    "altText": null,
                    "height": 3840,
                    "width": 2880,
                    "url": "https://cdn.impala.travel/properties/ckn8r8c1n00qp0snn7fwb1mzi.jpg"
                },
                {
                    "altText": null,
                    "height": 853,
                    "width": 1280,
                    "url": "https://cdn.impala.travel/properties/ckn8r94na00qq0snnfm2yflfv.jpg"
                }
            ]
        },
        {
            "roomTypeId": "631c0f45-bc08-4118-93fa-2200f14032a2",
            "name": "Double Room",
            "description": "Double rooms at Waterfront Hotel feature a double bed, flat-screen TV, tea/coffee maker and electric kettle. Small Private bathroom.",
            "maxOccupancy": 2,
            "rates": [],
            "amenities": [
                {
                    "code": 123,
                    "formatted": "Wireless internet connection"
                },
                {
                    "code": 50,
                    "formatted": "Hairdryer"
                },
                {
                    "code": 28,
                    "formatted": "Desk"
                },
                {
                    "code": 15,
                    "formatted": "Bath or Shower"
                },
                {
                    "code": 11,
                    "formatted": "Bathroom amenities (free toiletries)"
                },
                {
                    "code": 3,
                    "formatted": "Alarm clock"
                },
                {
                    "code": 271,
                    "formatted": "Separate toilet area"
                },
                {
                    "code": 251,
                    "formatted": "TV"
                }
            ],
            "images": [
                {
                    "altText": null,
                    "height": 768,
                    "width": 1024,
                    "url": "https://cdn.impala.travel/properties/ckn8rc9p500qv0snn4hkpcofm.jpg"
                },
                {
                    "altText": null,
                    "height": 2880,
                    "width": 3840,
                    "url": "https://cdn.impala.travel/properties/ckn8rbuy300qu0snn96vrbbmt.jpg"
                },
                {
                    "altText": null,
                    "height": 2362,
                    "width": 3543,
                    "url": "https://cdn.impala.travel/properties/ckn8rbaao00qt0snndhfed1qe.jpg"
                },
                {
                    "altText": null,
                    "height": 768,
                    "width": 1024,
                    "url": "https://cdn.impala.travel/properties/ckn8raemn00qs0snna3o87150.jpg"
                },
                {
                    "altText": null,
                    "height": 2367,
                    "width": 3543,
                    "url": "https://cdn.impala.travel/properties/ckn8ra71s00qr0snn1ppvaurs.jpg"
                }
            ]
        },
        {
            "roomTypeId": "d271436d-cbe5-454e-9f37-dd992acae095",
            "name": "Twin Room",
            "description": "The twin room features two single beds, flat-screen TV, electric kettle and tea/coffee maker. Small Private bathroom.",
            "maxOccupancy": 2,
            "rates": [],
            "amenities": [
                {
                    "code": 11,
                    "formatted": "Bathroom amenities (free toiletries)"
                },
                {
                    "code": 15,
                    "formatted": "Bath or Shower"
                },
                {
                    "code": 123,
                    "formatted": "Wireless internet connection"
                },
                {
                    "code": 271,
                    "formatted": "Separate toilet area"
                },
                {
                    "code": 270,
                    "formatted": "Seating area with sofa/chair"
                },
                {
                    "code": 251,
                    "formatted": "TV"
                },
                {
                    "code": 3,
                    "formatted": "Alarm clock"
                },
                {
                    "code": 28,
                    "formatted": "Desk"
                },
                {
                    "code": 50,
                    "formatted": "Hairdryer"
                }
            ],
            "images": [
                {
                    "altText": null,
                    "height": 3840,
                    "width": 2880,
                    "url": "https://cdn.impala.travel/properties/ckn8redko00qy0snn9cngdfbu.jpg"
                },
                {
                    "altText": null,
                    "height": 2356,
                    "width": 3543,
                    "url": "https://cdn.impala.travel/properties/ckn8rdd5000qw0snndkln67ds.jpg"
                },
                {
                    "altText": null,
                    "height": 853,
                    "width": 1280,
                    "url": "https://cdn.impala.travel/properties/ckn8rdy4z00qx0snnaak5hubr.jpg"
                },
                {
                    "altText": null,
                    "height": 3840,
                    "width": 2880,
                    "url": "https://cdn.impala.travel/properties/ckn8rf4zy00qz0snn4gd45w9e.jpg"
                }
            ]
        }
    ]
}];
const mockHotelsFromCache = [{
    "hotelId": "2196c8c9-bc59-4f0f-81bf-3b1e59dfe215",
    "name": "Harbour House Hotel [SANDBOX]",
    "currency": "GBP",
    "description": {
        "short": "The Harbour House Hotel, and Anglesea Apartments is located in the picturesque seaside village of Portpatrick, Dumfries and Galloway. Settled in south west Scotland with views over the Irish Sea, the hotel has a seafront terraced restauran  as well as a cosy lounge and bar area."
    },
    "imageUrls": {
        "0": {
            "altText": null,
            "height": 777,
            "width": 1600,
            "url": "https://cdn.impala.travel/properties/ckn8rkt4100rg0snn5uoe6ev4.jpg",
            "isHeroImage": true
        }
    },
    "address": {
        "cityName": "Portpatrick",
        "countryCode": "GBR"
    },
},
{
    "hotelId": "8600bc8b-5c0f-4aae-9bcd-b44cde7bfbce",
    "name": "Waterfront Portpatrick  [SANDBOX]",
    "currency": "GBP",
    "description": {
        "short": "The Waterfront Hotel is a small quaint hotel with a nautical theme right on the harbour in the beautiful village of Portpatrick, with a large terrace and quaint cozy small lounge, and a bright Bistro restaurant. "
    },
    "imageUrls": {
        "0": {
            "altText": null,
            "height": 768,
            "width": 1024,
            "url": "https://cdn.impala.travel/properties/ckn8rx2eq00sp0snne3co5f0g.jpg",
            "isHeroImage": true
        }
    },
    "address": {
        "cityName": "Portpatrick",
        "countryCode": "GBR",
    }
}];

