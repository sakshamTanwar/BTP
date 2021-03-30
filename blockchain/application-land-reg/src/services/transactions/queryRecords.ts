import { submitTransaction } from './submitTransaction';

export async function queryRecords(
    village: string,
    subDistrict: string,
    district: string,
    state: string,
) {
    return await submitTransaction('getRecords', [
        village,
        subDistrict,
        district,
        state,
    ]);
}
