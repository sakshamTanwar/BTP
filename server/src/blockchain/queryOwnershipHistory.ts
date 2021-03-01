import { submitTransaction } from './submitTransaction';
import { IOwnershipHistory } from '../interfaces/blockchainInterfaces';

export async function queryOwnershipHistory(
    khasraNo: string,
    village: string,
    subDistrict: string,
    district: string,
    state: string,
): Promise<Array<IOwnershipHistory>> {
    let result = await submitTransaction('getOwnershipHistory', [
        khasraNo,
        village,
        subDistrict,
        district,
        state,
    ]);

    result = result.map((data: any) => {
        let ownerHistory: IOwnershipHistory = {
            land: data[0],
            transferHistory: data[1].map((entry: any) => entry.Record),
        };
        return ownerHistory;
    });
    return result;
}
