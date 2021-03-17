import path from 'path';
import { Request } from 'express';
import { transferLand } from '../services/transactions/transferLand';
import { uploadFile } from '../services/ipfs/uploadFile';
import genCertTrLand from '../services/certificates/transferLandCertificate';

function isDataValid(
    khasraNo: any,
    village: any,
    subDistrict: any,
    district: any,
    state: any,
    currentKhataNo: any,
    currentOwnerName: any,
    newKhataNo: any,
    newOwnerName: any,
    price: any,
    dateTime: any,
) {
    const khasraRe = new RegExp('^[0-9]+(/[0-9]+)*$');
    const nameRe = new RegExp('^[a-zA-Z][a-zA-Z ]*$');

    if (
        !khasraRe.test(khasraNo) ||
        !nameRe.test(village) ||
        !nameRe.test(subDistrict) ||
        !nameRe.test(district) ||
        !nameRe.test(state) ||
        !nameRe.test(currentOwnerName) ||
        !nameRe.test(newOwnerName)
    )
        return false;

    currentKhataNo = parseInt(currentKhataNo);
    newKhataNo = parseInt(newKhataNo);
    price = parseInt(price);
    dateTime = parseInt(dateTime);

    if (
        isNaN(currentKhataNo) ||
        isNaN(newKhataNo) ||
        isNaN(price) ||
        isNaN(dateTime)
    )
        return false;

    if (currentKhataNo <= 0 || newKhataNo <= 0 || price <= 0) return false;

    return true;
}

async function transferLandController(req: Request) {
    let {
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
        date,
        dateTime,
    } = req.body;

    if (
        !isDataValid(
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
            dateTime,
        )
    ) {
        throw new Error('Invalid Data');
    }

    date = new Date(parseInt(dateTime));

    const savePath = path.join(
        process.cwd(),
        'temp',
        `trLand${new Date().getTime()}.pdf`,
    );
    await genCertTrLand(
        {
            khasraNo,
            village,
            subDistrict,
            district,
            state,
            prevOwner: {
                khataNo: currentKhataNo,
                name: currentOwnerName,
            },
            newOwner: {
                khataNo: newKhataNo,
                name: newOwnerName,
            },
            price,
            timestamp: date,
        },
        process.env.CERT,
        savePath,
    );

    const certificate = (await uploadFile(savePath)).cid.toString();

    const otherDocs = [];
    if (req.files && Object.keys(req.files).length > 0) {
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        for (const file of files['otherDocs']) {
            const ipfsRes = await uploadFile(file.path);
            otherDocs.push(ipfsRes.cid.toString());
        }
    }

    await transferLand(
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
        date,
        certificate,
        otherDocs,
    );
}

export default transferLandController;
