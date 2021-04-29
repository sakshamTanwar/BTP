import { Request } from 'express';
import { queryRecords } from '../services/transactions/queryRecords';
import { nameRe } from './constants';

function isDataValid(
    village: any,
    subDistrict: any,
    district: any,
    state: any,
) {
    if (!nameRe.test(district) || !nameRe.test(state)) return false;

    if (subDistrict.length !== 0 && !nameRe.test(subDistrict)) return false;
    if (village.length !== 0 && !nameRe.test(village)) return false;

    return true;
}

async function queryRecordsController(req: Request) {
    let { village, subDistrict, district, state } = req.body;

    if (!isDataValid(village, subDistrict, district, state)) {
        throw new Error('Invalid Data');
    }

    const response = await queryRecords(village, subDistrict, district, state);

    return response;
}

export default queryRecordsController;
