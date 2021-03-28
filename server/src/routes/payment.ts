import express from 'express';
import passport from 'passport';
import { PaymentHandler } from '../services/paymentHandler';

const router = express.Router();

router.get(
    '/initiate',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        let { khasraNo, village, subDistrict, district, state } = req.query;

        if (!khasraNo || !village || !subDistrict || !district || !state) {
            res.status(400).send('Validation Failed');
        }

        try {
            const orderDetails = await PaymentHandler.generateOrder(
                (req.user as any).email as string,
                khasraNo as string,
                village as string,
                subDistrict as string,
                district as string,
                state as string,
            );

            res.json({
                order_id: orderDetails.id,
            });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
