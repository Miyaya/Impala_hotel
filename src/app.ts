import express from 'express';
import dotenv from 'dotenv';
import { loadHotels } from './services/hotel';
import syncHotels from './services/cronJob';
import swaggerUi from "swagger-ui-express";

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

const router = require('./routers/index');
app.use(router);

const swaggerDocument = require('../swagger.json');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

loadHotels();
syncHotels();

app.listen(port, () => {
    console.log(`server is listening on ${port} !!!`);
});
