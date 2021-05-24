import express from 'express';
import multer, { Field } from 'multer';
import bodyParser from 'body-parser';
import path from 'path';
import addLandController from '../controllers/addLand';
import transferLandController from '../controllers/transferLand';
import splitLandController from '../controllers/splitLand';
import queryVillageController from '../controllers/queryVillage';
import queryHistoryController from '../controllers/queryHistory';

const router = express.Router();
const upload = multer({ dest: path.join(process.cwd(), 'uploads') });

router.get('/add', (req, res, next) => {
    res.render('add.ejs');
});

router.get('/transfer', (req, res, next) => {
    res.render('transfer.ejs');
});

router.get('/split', (req, res, next) => {
    res.render('split.ejs');
});

router.get('/queryVillage', (req, res, next) => {
    res.render('queryVillage.ejs');
});

router.get('/queryHistory', (req, res, next) => {
    res.render('queryHistory.ejs');
});

router.post(
    '/add',
    upload.fields([{ name: 'otherDocs' }]),
    async (req, res, next) => {
        try {
            await addLandController(req);
            res.render('home.ejs', {
                alert: true,
                title: 'Land Registration Department',
            });
        } catch (err) {
            res.render('add.ejs', { errorMsg: err.message, data: req.body });
        }
    },
);

router.post(
    '/transfer',
    upload.fields([{ name: 'otherDocs' }]),
    async (req, res, next) => {
        try {
            await transferLandController(req);
            return res.render('home.ejs', {
                alert: true,
                title: 'Land Registration Department',
            });
        } catch (err) {
            res.render('transfer.ejs', {
                errorMsg: err.message,
                data: req.body,
            });
        }
    },
);

router.post(
    '/split',
    upload.fields([{ name: 'otherDocsA' }, { name: 'otherDocsB' }]),
    async (req, res, next) => {
        try {
            await splitLandController(req);
            return res.render('home.ejs', {
                alert: true,
                title: 'Land Registration Department',
            });
        } catch (err) {
            res.render('split.ejs', { errorMsg: err.message, data: req.body });
        }
    },
);

router.post(
    '/queryVillage',
    bodyParser.urlencoded({ extended: true }),
    async (req, res, next) => {
        try {
            let records = await queryVillageController(req);
            return res.render('showVillageRecords.ejs', { data: records });
        } catch (err) {
            res.render('queryVillage.ejs', {
                errorMsg: err.message,
                data: req.body,
            });
        }
    },
);

router.post(
    '/queryHistory',
    bodyParser.urlencoded({ extended: true }),
    async (req, res, next) => {
        try {
            let records = await queryHistoryController(req);
            return res.render('showHistory.ejs', { data: records });
        } catch (err) {
            res.render('queryHistory.ejs', {
                errorMsg: err.message,
                data: req.body,
            });
        }
    },
);

export default router;
