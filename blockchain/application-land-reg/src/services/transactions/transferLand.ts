import { submitTransaction } from './submitTransaction';

export async function transferLand(
    khasraNo: string,
    village: string,
    subDistrict: string,
    district: string,
    state: string,
    currentKhataNo: number,
    currentOwnerName: string,
    newKhataNo: number,
    newOwnerName: string,
    price: number,
    date: Date,
    certificate: string,
    landRecordCertificate: string,
    otherDocs: Array<string>,
) {
    await submitTransaction('transferLand', [
        khasraNo,
        village,
        subDistrict,
        district,
        state,
        currentKhataNo.toString(),
        currentOwnerName,
        newKhataNo.toString(),
        newOwnerName,
        price.toString(),
        date.getTime().toString(),
        certificate,
        landRecordCertificate,
        JSON.stringify(otherDocs),
    ]);
}
