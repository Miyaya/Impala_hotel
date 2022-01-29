# Impala_hotel
API for searching hotels according to country code and city name. The data will be updated every hour.

## Api Introduction
### GET /hotels
**Request**: `countryCode`, `cityName`
**Response**: An array fo hotels
> NOTE: `countryCode` is required. `countryCode` follows ISO 3166-1 alpha-3 standard. *E.g. UK: `GRB`, Spain: `ESP`, Italy: `ITA`, Marocco: `MAR`*

## How to
- Clone this project
- Go to folder Impala_hotel
- Install dependencies
```
npm i
```

- Copy file `.env.example` to `.env` to set environmental variables

#### Then you can choose:
- Start Dev mode
```
npm run dev
```
- Or, build project
```
npm run build
node dist/app.js
```
- Open browser to `http://localhost:{port}/docs/` to use Swagger UI 
> NOTE: port default = 3000