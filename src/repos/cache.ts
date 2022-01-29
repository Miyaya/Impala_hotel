import Cache from "../models/cache";
import dotenv from 'dotenv';

dotenv.config();

const ttl = process.env.TTL_CACHE || 3600;
const cache = new Cache(Number(ttl));

export default cache;