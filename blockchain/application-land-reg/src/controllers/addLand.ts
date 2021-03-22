import path from 'path';
import { Request } from 'express';
import { addLand } from '../services/transactions/addLand';
import { uploadFile } from '../services/ipfs/uploadFile';
import genCertAddLand from '../services/certificates/addLandCertificate';
import { ILand } from '../../../contract/src/land';

function isDataValid(
    khasraNo: any,
    village: any,
    subDistrict: any,
    district: any,
    state: any,
    numPts: any,
    area: any,
    khataNo: any,
    ownerName: any,
) {
    const khasraRe = new RegExp('^[0-9]+(/[0-9]+)*$');
    const nameRe = new RegExp('^[a-zA-Z][a-zA-Z ]*$');

    if (
        !khasraRe.test(khasraNo) ||
        !nameRe.test(village) ||
        !nameRe.test(subDistrict) ||
        !nameRe.test(district) ||
        !nameRe.test(state) ||
        !nameRe.test(ownerName)
    )
        return false;

    numPts = parseInt(numPts);
    area = parseInt(area);
    khataNo = parseInt(khataNo);

    if (isNaN(numPts) || isNaN(area) || isNaN(khataNo)) return false;

    if (numPts < 3 || area <= 0 || khataNo <= 0) return false;

    return true;
}

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
        !isDataValid(
            khasraNo,
            village,
            subDistrict,
            district,
            state,
            numPts,
            area,
            khataNo,
            ownerName,
        )
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

    const savePath = path.join(
        process.cwd(),
        'temp',
        `addLand${new Date().getTime()}.pdf`,
    );
    await genCertAddLand(
        {
            khasraNo,
            village,
            subDistrict,
            district,
            state,
            area,
            owner: {
                khataNo,
                name: ownerName,
            },
        } as ILand,
        process.env.CERT,
        savePath,
    );
    const certificate = await uploadFile(savePath);

    const otherDocs = [];
    if (req.files && Object.keys(req.files).length > 0) {
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        for (const file of files['otherDocs']) {
            const ipfsRes = await uploadFile(file.path);
            otherDocs.push(ipfsRes);
        }
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
