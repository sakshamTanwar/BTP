import { State } from './ledger-api/state';
import { IOwner } from './constants';

export interface ILandTransfer {
    landKey: string;
    price: Number;
    timestamp: Number;
    prevOwner: IOwner;
    newOwner: IOwner;
}

export class LandTransfer extends State {
    private landKey: string;
    private price: Number;
    private timestamp: Number;
    private prevOwner: IOwner;
    private newOwner: IOwner;

    constructor(obj: ILandTransfer) {
        super(LandTransfer.getClass(), [obj.landKey, obj.timestamp.toString()]);
        Object.assign(this, obj);
    }

    static fromBuffer(buffer: Buffer) {
        return LandTransfer.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data: Buffer) {
        return State.deserializeClass(data, LandTransfer);
    }

    static getClass() {
        return 'landTransferRecord';
    }

    static createInstance(
        landKey: string,
        price: Number,
        timestamp: Number,
        prevOwner: IOwner,
        newOwner: IOwner,
    ) {
        return new LandTransfer({
            landKey,
            price,
            timestamp,
            prevOwner,
            newOwner,
        });
    }
}
