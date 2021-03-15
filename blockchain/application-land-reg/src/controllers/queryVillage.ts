import { Request } from 'express';
import { queryAllVillageRecords } from '../services/transactions/queryAllVillageRecords';

async function queryVillageController(req: Request) {
    let { village, subDistrict, district, state } = req.body;

    if (!village || !subDistrict || !district || !state) {
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
