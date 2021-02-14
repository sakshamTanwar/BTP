import { submitTransaction } from './submitTransaction';

export async function transferLand(
    khasraNo: string,
    village: string,
    subDistrict: string,
    district: string,
    state: string,
    currentKhataNo: Number,
    currentOwnerName: string,
    newKhataNo: Number,
    newOwnerName: string,
    price: Number,
    date: Date = new Date(),
) {
    await submitTransaction('transferLand', [
        khasraNo,
        village,
        subDistrict,
        district,
        state,
        currentKhataNo,
        currentOwnerName,
        newKhataNo,
        newOwnerName,
        price,
        date.getTime(),
    ]);
}
