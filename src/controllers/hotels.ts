import { Request, Response, NextFunction } from 'express';


const getHotels = async (req: Request, res: Response, next: NextFunction) => {
    let id: string = req.params.id;

    //TODO getHotels[hotel service]
    // country name*
    // city name

    //let result = service.getHotel(req.countryCode, req.cityName?);
    // return res.status(200).json({
    //     message: result
    // });
};

export default getHotels;