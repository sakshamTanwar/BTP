import { Request } from 'express';
import { addLand } from '../services/transactions/addLand';
import { uploadFile } from '../services/ipfs/uploadFile';

async function addLandController(req: Request) {
    let {
        khasraNo,
        village,
        subDistrict,
        district,
        state,
        numPts,
        area,
        khataNo,
        ownerName,
    } = req.body;

    if (
        !khasraNo ||
        !village ||
        !subDistrict ||
        !district ||
        !state ||
        !numPts ||
        !area ||
        !khataNo ||
        !ownerName
    ) {
        throw new Error('Invalid Data');
    }

    let pts = [];

    for (let i = 0; i < numPts; i++) {
        if (!req.body[`lat${i}`] || !req.body[`lon${i}`]) {
            throw new Error('Invalid Data');
        }

        pts.push({
            lat: req.body[`lat${i}`],
            lon: req.body[`lon${i}`],
        });
    }

    const certificate = ' ';

    const otherDocs = [];

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    for (const file of files['otherDocs']) {
        const ipfsRes = await uploadFile(file.path);
        otherDocs.push(ipfsRes.cid.toString());
    }

    await addLand(
        khasraNo,
        village,
        subDistrict,
        district,
        state,
        pts,
        area,
        khataNo,
        ownerName,
        certificate,
        otherDocs,
    );
}

export default addLandController;
