import { submitTransaction } from './submitTransaction';
import { ILandRecord } from '../interfaces/blockchainInterfaces';

export async function queryRecords(
    village: string,
    subDistrict: string,
    district: string,
    state: string,
): Promise<Array<ILandRecord>> {
    let result = await submitTransaction('getRecords', [
        village,
        subDistrict,
        district,
        state,
    ]);

    return result.map((data: any) => data.Record);
}
