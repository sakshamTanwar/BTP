import { Request } from 'express';
import { queryAllVillageRecords } from '../services/transactions/queryAllVillageRecords';

function isDataValid(
    village: any,
    subDistrict: any,
    district: any,
    state: any,
) {
    const nameRe = new RegExp('^[a-zA-Z][a-zA-Z ]*$');

    if (
        !nameRe.test(village) ||
        !nameRe.test(subDistrict) ||
        !nameRe.test(district) ||
        !nameRe.test(state)
    )
        return false;

    return true;
}

async function queryVillageController(req: Request) {
    let { village, subDistrict, district, state } = req.body;

    if (!isDataValid(village, subDistrict, district, state)) {
        throw new Error('Invalid Data');
    }

    const response = await queryAllVillageRecords(
        village,
        subDistrict,
        district,
        state,
    );

    return response;
}

export default queryVillageController;
