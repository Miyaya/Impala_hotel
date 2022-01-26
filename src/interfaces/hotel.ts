class Hotel {
    hotelId: string;
    address: {
        country: string;
    };
    title: string;
    description: {
        [index: string]: string;
    }
    imageUrls: {
        [index: number]: string;
    }
        ;

    constructor(hotelId: string, country: string, title: string, description_short: string, imageUrl: string) {
        this.hotelId = hotelId;
        this.address = { country: country };
        this.title = title;
        this.description = { "short": description_short };
        this.imageUrls = { 0: imageUrl }
    }
}

export default Hotel;