import { StateList } from './ledger-api/statelist';
import { LandTransfer } from './landtransfer';
import { Context } from 'fabric-contract-api';
import { TRANSFERLIST } from './constants';

export class LandTransferList extends StateList {
    constructor(ctx: Context) {
        super(ctx, TRANSFERLIST);
        this.use(LandTransfer);
    }

    async addLandTransfer(tranfer: LandTransfer) {
        return this.addState(tranfer);
    }

    async getLandTransfer(transferKey: string) {
        return this.getState(transferKey);
    }
}
