import { Request } from 'express';
import { splitLand } from '../services/transactions/splitLand';
import { uploadFile } from '../services/ipfs/uploadFile';

function isDataValid(
    khasraNo: any,
    village: any,
    subDistrict: any,
    district: any,
    state: any,
    newKhasraNoA: any,
    numPtsA: any,
    areaA: any,
    newKhasraNoB: any,
    numPtsB: any,
    areaB: any,
) {
    const khasraRe = new RegExp('^[0-9]+(/[0-9]+)*$');
    const nameRe = new RegExp('^[a-zA-Z][a-zA-Z ]*$');

    if (
        !khasraRe.test(khasraNo) ||
        !nameRe.test(village) ||
        !nameRe.test(subDistrict) ||
        !nameRe.test(district) ||
        !nameRe.test(state)
    )
        return false;

    newKhasraNoA = parseInt(newKhasraNoA);
    numPtsA = parseInt(numPtsA);
    areaA = parseInt(areaA);
    newKhasraNoB = parseInt(newKhasraNoB);
    numPtsB = parseInt(numPtsB);
    areaB = parseInt(areaB);

    if (
        isNaN(newKhasraNoA) ||
        isNaN(numPtsA) ||
        isNaN(areaA) ||
        isNaN(newKhasraNoB) ||
        isNaN(numPtsB) ||
        isNaN(areaB)
    )
        return false;

    if (
        newKhasraNoA <= 0 ||
        numPtsA < 3 ||
        areaA <= 0 ||
        newKhasraNoB <= 0 ||
        numPtsB < 3 ||
        areaB <= 0
    )
        return false;

    return true;
}

async function uploadFiles(files: Express.Multer.File[]) {
    const cids: string[] = [];
    if (!files) return cids;
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
        !isDataValid(
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
        )
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
