import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema<IPayment>({
    order_id: {
        type: String,
        required: true,
    },
    payment_id: {
        type: String,
        required: true,
        unique: true,
    },
    signature: {
        type: String,
        required: true,
        unique: true,
    },
});

export interface IPayment extends mongoose.Document {
    order_id: string;
    payment_id: string;
    signature: string;
}

export const Payment = mongoose.model('Payments', paymentSchema);
