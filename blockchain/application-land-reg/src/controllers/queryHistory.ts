import { Request } from 'express';
import { queryOwnershipHistory } from '../services/transactions/queryOwnershipHistory';

function isDataValid(
    khasraNo: any,
    village: any,
    subDistrict: any,
    district: any,
    state: any,
) {
    const khasraRe = new RegExp('^[0-9]+(/[0-9]+)*$');
    const nameRe = new RegExp('^[a-zA-Z][a-zA-Z ]*$');

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
