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
    areaA: number,
    newKhasraNoB: string,
    newPolygonPointsB: Array<IPoint>,
    areaB: number,
) {
    await submitTransaction('splitLand', [
        khasraNo,
        village,
        subDistrict,
        district,
        state,
        newKhasraNoA,
        JSON.stringify(newPolygonPointsA),
        areaA.toString(),
        newKhasraNoB,
        JSON.stringify(newPolygonPointsB),
        areaB.toString(),
    ]);
}
