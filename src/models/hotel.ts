class Hotel {
    hotelId: string;
    address: {
        countryCode: string;
        cityName: string;
    };
    title: string;
    description: {
        [index: string]: string;
    }
    imageUrls: {
        [index: number]: string;
    }
        ;

    constructor(hotelId: string, countryCode: string, cityName: string, title: string, description_short: string, imageUrl: string) {
        this.hotelId = hotelId;
        this.address = { countryCode: countryCode, cityName: cityName };
        this.title = title;
        this.description = { "short": description_short };
        this.imageUrls = { 0: imageUrl }
    }
}

export default Hotel;