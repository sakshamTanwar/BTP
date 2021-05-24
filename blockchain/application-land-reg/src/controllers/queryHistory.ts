import { Request } from 'express';
import { queryOwnershipHistory } from '../services/transactions/queryOwnershipHistory';
import { khasraRe, nameRe } from './constants';

function isDataValid(
    khasraNo: any,
    village: any,
    subDistrict: any,
    district: any,
    state: any,
) {
    if (
        !khasraRe.test(khasraNo) ||
        !nameRe.test(village) ||
        !nameRe.test(subDistrict) ||
        !nameRe.test(district) ||
        !nameRe.test(state)
    )
        return false;

    return true;
}

async function queryHistoryController(req: Request) {
    let { khasraNo, village, subDistrict, district, state } = req.body;

    if (!isDataValid(khasraNo, village, subDistrict, district, state)) {
        throw new Error('Invalid Data');
    }

    const response = await queryOwnershipHistory(
        khasraNo,
        village,
        subDistrict,
        district,
        state,
    );

    return response;
}

export default queryHistoryController;
