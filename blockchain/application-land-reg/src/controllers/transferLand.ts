import path from 'path';
import { Request } from 'express';
import { transferLand } from '../services/transactions/transferLand';
import { uploadFile } from '../services/ipfs/uploadFile';
import genCertTrLand from '../services/certificates/transferLandCertificate';

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
    } = req.body;

    if (
        !khasraNo ||
        !village ||
        !subDistrict ||
        !district ||
        !state ||
        !currentKhataNo ||
        !currentOwnerName ||
        !newKhataNo ||
        !newOwnerName ||
        !price ||
        !date
    ) {
        throw new Error('Invalid Data');
    }

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
                kahtaNo: currentKhataNo,
                name: currentOwnerName,
            },
            newOwner: {
                khataNo: newKhataNo,
                name: newOwnerName,
            },
            price,
        },
        process.env.CERT,
        savePath,
    );

    const certificate = (await uploadFile(savePath)).cid.toString();

    const otherDocs = [];

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    for (const file of files['otherDocs']) {
        const ipfsRes = await uploadFile(file.path);
        otherDocs.push(ipfsRes.cid.toString());
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
