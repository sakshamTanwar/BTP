import express from 'express';
import multer, { Field } from 'multer';
import path from 'path';
import addLandController from '../controllers/addLand';
import transferLandController from '../controllers/transferLand';
import splitLandController from '../controllers/splitLand';

const router = express.Router();
const upload = multer({ dest: path.join(process.cwd(), 'uploads') });

router.post('/add', upload.array('otherDocs'), async (req, res, next) => {
    try {
        await addLandController(req);
        return res.json({
            success: true,
        });
    } catch (err) {
        next(err);
    }
});

router.post('/transfer', upload.array('otherDocs'), async (req, res, next) => {
    try {
        await transferLandController(req);
        return res.json({
            success: true,
        });
    } catch (err) {
        next(err);
    }
});

router.post(
    '/split',
    upload.fields([{ name: 'otherDocsA' }, { name: 'otherDocsB' }]),
    async (req, res, next) => {
        try {
            await splitLandController(req);
            return res.json({
                success: true,
            });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
