import { Context } from 'fabric-contract-api';
import { stat } from 'fs/promises';
import { Iterators } from 'fabric-shim-api';

export class QueryUtils {
    private ctx: Context;
    private name: string;

    constructor(ctx: Context, listName: string) {
        this.ctx = ctx;
        this.name = listName;
    }

    async getAssetHistory(
        khasraNo: string,
        village: string,
        subDistrict: string,
        district: string,
        state: string,
    ) {
        let ledgerKey = await this.ctx.stub.createCompositeKey(this.name, [
            state,
            district,
            subDistrict,
            village,
            khasraNo,
        ]);

        const resultsIterator = await this.ctx.stub.getStateByPartialCompositeKey(
            this.name,
            [state, district, subDistrict, village, khasraNo],
        );
        let results = await this.getAllResults(resultsIterator);
        return results;
    }

    async getAllRecordsByPartialKey(partialKey: Array<string>) {
        const resultsIterator = await this.ctx.stub.getStateByPartialCompositeKey(
            this.name,
            partialKey,
        );
        let results = await this.getAllResults(resultsIterator);
        return results;
    }

    async getAllResults(
        iterator:
            | Iterators.CommonIterator<Iterators.KeyModification>
            | Iterators.CommonIterator<Iterators.KV>,
        isHistory: Boolean = false,
    ) {
        let allResults: Array<any> = [];
        let res: { [key: string]: any } = { done: false, value: null };

        while (true) {
            res = await iterator.next();
            let jsonRes: any = {};
            if (res.value && res.value.value.toString()) {
                if (isHistory && isHistory === true) {
                    jsonRes.TxId = res.value.txId;
                    jsonRes.Timestamp = res.value.timestamp;
                    jsonRes.Timestamp = new Date(
                        res.value.timestamp.seconds.low * 1000,
                    );
                    let ms = res.value.timestamp.nanos / 1000000;
                    jsonRes.Timestamp.setMilliseconds(ms);
                    if (res.value.is_delete) {
                        jsonRes.IsDelete = res.value.is_delete.toString();
                    } else {
                        try {
                            jsonRes.Value = JSON.parse(
                                res.value.value.toString('utf8'),
                            );
                        } catch (err) {
                            console.log(err);
                            jsonRes.Value = res.value.value.toString('utf8');
                        }
                    }
                } else {
                    jsonRes.Key = res.value.key;
                    try {
                        jsonRes.Record = JSON.parse(
                            res.value.value.toString('utf8'),
                        );
                    } catch (err) {
                        console.log(err);
                        jsonRes.Record = res.value.value.toString('utf8');
                    }
                }
                allResults.push(jsonRes);
            }

            if (res.done) {
                await iterator.close();
                return allResults;
            }
        }
    }
}
