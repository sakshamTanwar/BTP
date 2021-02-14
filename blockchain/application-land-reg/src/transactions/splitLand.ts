import { submitTransaction } from './submitTransaction';
import { IPoint } from '../../../contract/src/land';

export async function splitLand(
    khasraNo: string,
    village: string,
    subDistrict: string,
    district: string,
    state: string,
    newKhasraNoA: string,
    newPolygonPointsA: Array<IPoint>,
    areaA: Number,
    newKhasraNoB: string,
    newPolygonPointsB: Array<IPoint>,
    areaB: Number,
) {
    await submitTransaction('splitLand', [
        khasraNo,
        village,
        subDistrict,
        district,
        state,
        newKhasraNoA,
        newPolygonPointsA,
        areaA,
        newKhasraNoB,
        newPolygonPointsB,
        areaB,
    ]);
}
