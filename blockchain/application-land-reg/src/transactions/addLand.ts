import { submitTransaction } from './submitTransaction';
import { IPoint } from '../../../contract/src/land';

export async function addLand(
    khasraNo: string,
    village: string,
    subDistrict: string,
    district: string,
    state: string,
    polygonPoints: Array<IPoint>,
    area: Number,
    khataNo: Number,
    ownerName: string,
) {
    let pts = {
        points: polygonPoints,
    };
    await submitTransaction('createLand', [
        khasraNo,
        village,
        subDistrict,
        district,
        state,
        JSON.stringify(pts),
        area,
        khataNo,
        ownerName,
    ]);
}
