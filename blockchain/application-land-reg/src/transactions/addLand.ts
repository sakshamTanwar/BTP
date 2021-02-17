import { submitTransaction } from './submitTransaction';
import { IPoint } from '../../../contract/src/land';

export async function addLand(
    khasraNo: string,
    village: string,
    subDistrict: string,
    district: string,
    state: string,
    polygonPoints: Array<IPoint>,
    area: number,
    khataNo: number,
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
        area.toString(),
        khataNo.toString(),
        ownerName,
    ]);
}
