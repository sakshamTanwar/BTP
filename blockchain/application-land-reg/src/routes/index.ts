import express from 'express';

const router = express.Router();

router.get('/', async (req, res, next) => {
    res.render('home.ejs', { title: 'Land Registration Department' });
});

export default router;
