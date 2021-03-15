import { Request } from 'express';
import { queryOwnershipHistory } from '../services/transactions/queryOwnershipHistory';

async function queryHistoryController(req: Request) {
    let { khasraNo, village, subDistrict, district, state } = req.body;

    if (!khasraNo || !village || !subDistrict || !district || !state) {
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
