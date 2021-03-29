import Razorpay from 'razorpay';
import util from 'util';
import crypto from 'crypto';
import { Payment } from '../models/payment';
import fetch from 'node-fetch';

export class PaymentHandler {
    private static razorpayInstance = new Razorpay({
        key_id: process.env.RZRPAY_KEY_ID,
        key_secret: process.env.RZRPAY_KEY_SECRET,
    });

    private static paymentAmount = 0;
    private static currency = 'INR';

    public static async generateOrder(
        userEmail: string,
        khasraNo: string,
        village: string,
        subDistrict: string,
        district: string,
        state: string,
    ) {
        const options = {
            amount: this.paymentAmount,
            currency: this.currency,
            notes: {
                user_email: userEmail,
                land_khasra: khasraNo,
                land_village: village,
                land_sub_district: subDistrict,
                land_district: district,
                land_state: state,
            },
        };

        const orderCreatePromise = util.promisify(
            this.razorpayInstance.orders.create,
        );

        const order = await orderCreatePromise(options);

        return order;
    }

    private static verifySignature(
        order_id: string,
        razorpay_payment_id: string,
        razorpay_signature: string,
    ) {
        return (
            crypto
                .createHmac('sha256', process.env.RZRPAY_KEY_SECRET)
                .update(order_id + '|' + razorpay_payment_id)
                .digest('hex') !== razorpay_signature
        );
    }

    private static async isPaymentComplete(
        order_id: string,
        payment_id: string,
    ) {
        const apiURL = `https://${process.env.RZRPAY_KEY_ID}:${process.env.RZRPAY_KEY_SECRET}@api.razorpay.com/v1/payments/${payment_id}`;

        const payment = JSON.parse(
            (await fetch(apiURL)).body.read().toString(),
        );

        return payment.status === 'captured' && payment.order_id === order_id;
    }

    public static async registerPayment(
        order_id: string,
        razorpay_order_id: string,
        razorpay_payment_id: string,
        razorpay_signature: string,
    ) {
        if (
            !this.verifySignature(
                order_id,
                razorpay_payment_id,
                razorpay_signature,
            )
        ) {
            throw Error('Invalid payment signature');
        }

        const completed = await this.isPaymentComplete(
            order_id,
            razorpay_payment_id,
        );

        if (!completed) {
            throw Error('Payment not complete');
        }

        let payment = new Payment({
            order_id: razorpay_order_id,
            payment_id: razorpay_payment_id,
            signature: razorpay_signature,
        });

        await payment.save();
    }

    public static async getOrderDetails(order_id: string) {
        const apiURL = `https://${process.env.RZRPAY_KEY_ID}:${process.env.RZRPAY_KEY_SECRET}@api.razorpay.com/v1/orders/${order_id}`;

        const order = JSON.parse((await fetch(apiURL)).body.read().toString());

        return order.notes;
    }
}
