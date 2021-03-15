import { Request } from 'express';
import { splitLand } from '../services/transactions/splitLand';
import { uploadFile } from '../services/ipfs/uploadFile';

async function uploadFiles(files: Express.Multer.File[]) {
    const cids = [];

    for (const file of files) {
        const ipfsRes = await uploadFile(file.path);
        cids.push(ipfsRes.cid.toString());
    }

    return cids;
}

function getPoints(req: Request, prefix: string, numPts: number) {
    let pts = [];

    for (let i = 0; i < numPts; i++) {
        if (!req.body[`${prefix}lat${i}`] || !req.body[`${prefix}lon${i}`]) {
            throw new Error('Invalid Data');
        }

        pts.push({
            lat: req.body[`${prefix}lat${i}`],
            lon: req.body[`${prefix}lon${i}`],
        });
    }

    return pts;
}

async function splitLandController(req: Request) {
    let {
        khasraNo,
        village,
        subDistrict,
        district,
        state,
        newKhasraNoA,
        numPtsA,
        areaA,
        newKhasraNoB,
        numPtsB,
        areaB,
    } = req.body;

    if (
        !khasraNo ||
        !village ||
        !subDistrict ||
        !district ||
        !state ||
        !newKhasraNoA ||
        !numPtsA ||
        !areaA ||
        !newKhasraNoB ||
        !numPtsB ||
        !areaB
    ) {
        throw new Error('Invalid Data');
    }

    const ptsA = getPoints(req, 'A', numPtsA);
    const ptsB = getPoints(req, 'B', numPtsB);

    const certificateA = ' ';
    const certificateB = ' ';

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const otherDocsA = await uploadFiles(files['otherDocsA']);
    const otherDocsB = await uploadFiles(files['otherDocsB']);

    await splitLand(
        khasraNo,
        village,
        subDistrict,
        district,
        state,
        newKhasraNoA,
        ptsA,
        areaA,
        certificateA,
        otherDocsA,
        newKhasraNoB,
        ptsB,
        areaB,
        certificateB,
        otherDocsB,
    );
}

export default splitLandController;
