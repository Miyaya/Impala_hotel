import cron from 'node-cron';
import { loadHotels } from './hotel';

function syncHotels() {
    let minutes = new Date().getMinutes();
    //cron.schedule(`${minutes} * * * *`, function () {
    cron.schedule(`* * * * *`, function () {
        loadHotels();
    });
}

export default syncHotels;