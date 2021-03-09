import express from 'express';
import multer, { Field } from 'multer';
import path from 'path';
import addLandController from '../controllers/addLand';

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

export default router;
