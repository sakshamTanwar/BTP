import { submitTransaction } from './submitTransaction';

export async function queryOwnershipHistory(
    khasraNo: string,
    village: string,
    subDistrict: string,
    district: string,
    state: string,
) {
    let result = await submitTransaction('getOwnershipHistory', [
        khasraNo,
        village,
        subDistrict,
        district,
        state,
    ]);

    return result;
}
