import express from 'express';
import path from 'path';
import { resolveCoords } from '../services/coordResolver';
import { LandRecordExtractor } from '../services/recordExtractor';
import { PDFGenerator } from '../services/pdfGenerator';
import { queryOwnershipHistory } from '../blockchain/queryOwnershipHistory';
import { enrollUser } from '../blockchain/enrollUser';
import passport from "passport"
import { EmailHandler } from "../services/emailHandler"
import {IRequest, IResponse, INext} from "../interfaces/httpinterfaces"


var router = express.Router();

router.get('/', async (req, res, next) => {
    //Takes lat and lon as query params

    let { lat, lon } = req.query;
    if (!lat || !lon)
        return res.sendFile(
            path.join(__dirname, '..', 'views', 'landrecord.html'),
        );
    console.log(`Lat=${lat} and lon=${lon}`);
    try {
        let resolvedInfo = await resolveCoords(lat, lon);
        let record = await LandRecordExtractor.extractLandRecordFromBL(
            resolvedInfo,
        );
        res.json({
            success: true,
            data: {
                khasra: record.khasraNo,
                village: record.village,
                subDistrict: record.subDistrict,
                district: record.district,
                state: record.state,
                points: record.polygonPoints
            },
        });
    } catch (err) {
        next(err);
    }
});


router.get('/enrolluser', (_, res) => {
    enrollUser().then(() => {
        res.send('Blockchain user enrolled');
    });
});


router.get('/resolve', async (req, res) => {
    let { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.sendFile(
            path.join(__dirname, '..', 'views', 'landrecordresolve.html'),
        );
    }

    let resolvedInfo = await resolveCoords(lat, lon);

    res.json({
        success: true,
        data: {
            resolvedInfo,
        },
    });
});


router.get('/generate', passport.authenticate('jwt', { session: false }), (req: IRequest, res: IResponse, next: INext) => {

    let { khasra, village, subDistrict, district, state } = req.query;

    if (!khasra || !village || !subDistrict || !district || !state) {
        return res.sendFile(
            path.join(__dirname, '..', 'views', 'landrecord.html'),
        );
    }

    queryOwnershipHistory(
        khasra as string,
        village as string,
        subDistrict as string,
        district as string,
        state as string,
    )
        .then(async records => {
            let nKhasra = (khasra as string).replace(/\//g, '_');
            let pdfPath = path.join(__dirname,'..','..','temp',`${nKhasra}_${village}.pdf`);
            PDFGenerator.generatePDF(
                records,
                pdfPath
            );
            console.log("PDF Generated");
            return pdfPath;
        })
        .then(pdfPath=>{
            EmailHandler.mailPdf(req.user.email, 'landRecord.pdf', pdfPath);
            res.json({
                success: true,
                message: "Land record emailed succesfully."
            })
        })
        .catch(err => {
            next(err);
        });
});


export default router;