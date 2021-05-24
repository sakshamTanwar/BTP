import express from 'express';
import passport from 'passport';
import { PaymentHandler } from '../services/paymentHandler';
import { PDFGenerator } from '../services/pdfGenerator';
import { queryOwnershipHistory } from '../blockchain/queryOwnershipHistory';
import path from 'path';
import { EmailHandler } from '../services/emailHandler';

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
                amount: orderDetails.amount,
            });
        } catch (err) {
            next(err);
        }
    },
);

function sendPdf(
    email: string,
    khasra: string,
    village: string,
    subDistrict: string,
    district: string,
    state: string,
) {
    queryOwnershipHistory(
        khasra as string,
        village as string,
        subDistrict as string,
        district as string,
        state as string,
    )
        .then(async (records) => {
            let nKhasra = (khasra as string).replace(/\//g, '_');
            let pdfPath = path.join(
                __dirname,
                '..',
                '..',
                'temp',
                `${nKhasra}_${village}.pdf`,
            );
            PDFGenerator.generatePDF(records, pdfPath);
            console.log('PDF Generated');
            return pdfPath;
        })
        .then((pdfPath) => {
            EmailHandler.mailPdf(email, 'landRecord.pdf', pdfPath);
        })
        .catch((err) => {
            throw err;
        });
}

router.get(
    '/verify',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        let {
            order_id,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.query;

        if (
            !order_id ||
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            res.status(400).send('Invalid Data');
            return;
        }

        try {
            await PaymentHandler.registerPayment(
                order_id as string,
                razorpay_order_id as string,
                razorpay_payment_id as string,
                razorpay_signature as string,
            );

            const orderDetails = await PaymentHandler.getOrderDetails(
                order_id as string,
            );
            sendPdf(
                orderDetails.user_email,
                orderDetails.land_khasra,
                orderDetails.land_village,
                orderDetails.land_sub_district,
                orderDetails.land_district,
                orderDetails.land_state,
            );
            res.json({
                success: true,
            });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
