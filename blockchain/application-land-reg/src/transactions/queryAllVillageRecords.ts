import { submitTransaction } from './submitTransaction';

export async function queryAllVillageRecords(
    village: string,
    subDistrict: string,
    district: string,
    state: string,
) {
    await submitTransaction('getAllRecordsInVillage', [
        village,
        subDistrict,
        district,
        state,
    ]);
}
