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
    certificateA: string,
    otherDocsA: Array<string>,
    newKhasraNoB: string,
    newPolygonPointsB: Array<IPoint>,
    areaB: number,
    certificateB: string,
    otherDocsB: Array<string>,
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
        certificateA,
        JSON.stringify(otherDocsA),
        newKhasraNoB,
        JSON.stringify(newPolygonPointsB),
        areaB.toString(),
        certificateB,
        JSON.stringify(otherDocsB),
    ]);
}
