import { submitTransaction } from './submitTransaction';

export async function queryLand(
    khasraNo: string,
    village: string,
    subDistrict: string,
    district: string,
    state: string,
) {
    return await submitTransaction('getLandRecord', [
        khasraNo,
        village,
        subDistrict,
        district,
        state,
    ]);
}