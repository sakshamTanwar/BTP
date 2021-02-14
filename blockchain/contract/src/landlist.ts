import { StateList } from './ledger-api/statelist';
import { Land } from './land';
import { Context } from 'fabric-contract-api';
import { LANDLIST } from './constants';

export class LandList extends StateList {
    constructor(ctx: Context) {
        super(ctx, LANDLIST);
        this.use(Land);
    }

    async addLand(land: Land) {
        return this.addState(land);
    }

    async getLand(landKey: string) {
        return this.getState(landKey);
    }

    async updateLand(land: Land) {
        return this.updateState(land);
    }
}
