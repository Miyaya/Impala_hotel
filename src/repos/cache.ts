import Cache from "../models/cache";

const cache = new Cache(Number(process.env.TTL_CACHE));

export default cache;