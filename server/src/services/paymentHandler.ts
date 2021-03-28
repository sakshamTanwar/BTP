import Razorpay from 'razorpay';
import util from 'util';

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
}
