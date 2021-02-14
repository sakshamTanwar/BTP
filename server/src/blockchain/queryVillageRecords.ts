import { submitTransaction } from './submitTransaction';

export async function queryAllVillageRecords(
    village: string,
    subDistrict: string,
    district: string,
    state: string,
) {
    let result = await submitTransaction('getAllRecordsInVillage', [
        village,
        subDistrict,
        district,
        state,
    ]);

    return result;
}
