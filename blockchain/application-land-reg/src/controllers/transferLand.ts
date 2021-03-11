import { Request } from 'express';
import { transferLand } from '../transactions/transferLand';
import { uploadFile } from '../ipfs/uploadFile';

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

    date = new Date(date);
    const certificate = ' ';

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
