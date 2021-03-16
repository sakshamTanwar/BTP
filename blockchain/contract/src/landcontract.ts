import { Contract, Context } from 'fabric-contract-api';
import { IPoint, Land } from './land';
import { LandList } from './landlist';
import { LandTransferList } from './landtransferlist';
import { QueryUtils } from './queryutils';
import { IOwner, LANDLIST, TRANSFERLIST } from './constants';
import { LandTransfer } from './landtransfer';

class LandContext extends Context {
    public landList: LandList;
    public landTransferList: LandTransferList;

    constructor() {
        super();
        this.landList = new LandList(this);
        this.landTransferList = new LandTransferList(this);
    }
}

export class LandContract extends Contract {
    constructor() {
        super('landContract');
    }

    createContext() {
        return new LandContext();
    }

    async createLand(
        ctx: LandContext,
        khasraNo: string,
        village: string,
        subDistrict: string,
        district: string,
        state: string,
        polygonPoints: string,
        area: string,
        khataNo: string,
        ownerName: string,
        certificate: string,
        otherDocs: string,
    ) {
        let owner: IOwner = { khataNo: Number(khataNo), name: ownerName };
        let othDocs: Array<string> = JSON.parse(otherDocs);
        let pts = JSON.parse(polygonPoints);
        pts = pts.points;
        let land: Land = Land.createInstance(
            khasraNo,
            village,
            subDistrict,
            district,
            state,
            pts,
            Number(area),
            owner,
            certificate,
            othDocs,
        );

        await ctx.landList.addLand(land);

        return JSON.stringify(land);
    }

    async transferLand(
        ctx: LandContext,
        khasraNo: string,
        village: string,
        subDistrict: string,
        district: string,
        state: string,
        currentKhataNo: string,
        currentOwnerName: string,
        newKhataNo: string,
        newOwnerName: string,
        price: string,
        transferDateTime: string,
        certificate: string,
        otherDocs: string,
    ) {
        let landKey = Land.makeKey([
            state,
            district,
            subDistrict,
            village,
            khasraNo,
        ]);

        let land: Land = await ctx.landList.getLand(landKey);
        let currentOwner: IOwner = {
            khataNo: Number(currentKhataNo),
            name: currentOwnerName,
        };

        if (land.isExpired()) {
            throw new Error('\nCannot split land, land record is expired');
        }

        if (!land.isOwner(currentOwner)) {
            throw new Error('\nLand is not owned by ' + currentOwnerName);
        }

        let newOwner: IOwner = {
            khataNo: Number(newKhataNo),
            name: newOwnerName,
        };

        land.setOwner(newOwner);
        let othDocs: Array<string> = JSON.parse(otherDocs);
        let landTransfer: LandTransfer = LandTransfer.createInstance(
            land.getKey(),
            Number(price),
            Number(transferDateTime),
            currentOwner,
            newOwner,
            certificate,
            othDocs,
        );

        await ctx.landList.updateLand(land);
        await ctx.landTransferList.addLandTransfer(landTransfer);
        return JSON.stringify([land, landTransfer]);
    }

    async splitLand(
        ctx: LandContext,
        khasraNo: string,
        village: string,
        subDistrict: string,
        district: string,
        state: string,
        newKhasraNoA: string,
        newPolygonPointsA: string,
        areaA: string,
        certificateA: string,
        otherDocsA: string,
        newKhasraNoB: string,
        newPolygonPointsB: string,
        areaB: string,
        certificateB: string,
        otherDocsB: string,
    ) {
        let landKey = Land.makeKey([
            state,
            district,
            subDistrict,
            village,
            khasraNo,
        ]);

        let land: Land = await ctx.landList.getLand(landKey);

        if (land.isExpired()) {
            throw new Error('\nCannot split land, land record is expired');
        }

        land.setExpired();

        let ptsA = JSON.parse(newPolygonPointsA);
        let othDocsA: Array<string> = JSON.parse(otherDocsA);
        let landA: Land = Land.createInstance(
            newKhasraNoA,
            village,
            subDistrict,
            district,
            state,
            ptsA,
            Number(areaA),
            land.getOwner(),
            certificateA,
            othDocsA,
            landKey,
        );

        let ptsB = JSON.parse(newPolygonPointsB);
        let othDocsB: Array<string> = JSON.parse(otherDocsB);
        let landB: Land = Land.createInstance(
            newKhasraNoB,
            village,
            subDistrict,
            district,
            state,
            ptsB,
            Number(areaB),
            land.getOwner(),
            certificateB,
            othDocsB,
            landKey,
        );

        await ctx.landList.updateLand(land);
        await ctx.landList.addLand(landA);
        await ctx.landList.addLand(landB);

        return JSON.stringify([landA, landB]);
    }

    async getOwnershipHistory(
        ctx: LandContext,
        khasraNo: string,
        village: string,
        subDistrict: string,
        district: string,
        state: string,
    ) {
        let queryLandTransfer = new QueryUtils(ctx, TRANSFERLIST);
        let results: Array<any> = [];

        let landKey = Land.makeKey([
            state,
            district,
            subDistrict,
            village,
            khasraNo,
        ]);

        let land: Land = await ctx.landList.getLand(landKey);

        while (true) {
            let result = await queryLandTransfer.getAssetHistory(
                land.getKhasraNo(),
                land.getVillage(),
                land.getSubDistrict(),
                land.getDistrict(),
                land.getState(),
            );

            results.push([land, result]);

            if (land.getParentLandKey() == null) {
                break;
            }

            land = await ctx.landList.getLand(land.getParentLandKey());
        }

        return JSON.stringify(results);
    }

    async getAllRecordsInVillage(
        ctx: LandContext,
        village: string,
        subDistrict: string,
        district: string,
        state: string,
    ) {
        let query = new QueryUtils(ctx, LANDLIST);
        let results = await query.getAllRecordsByPartialKey([
            state,
            district,
            subDistrict,
            village,
        ]);
        console.log(results);
        return JSON.stringify(results);
    }

    async getLandByCertificate(
        ctx: LandContext, 
        certificate: string
    ) {
		

        let query = new QueryUtils(ctx, LANDLIST);
        let results = await query.getRecordByQueryObject({
            certificate: certificate
        });
        console.log(results);
        return JSON.stringify(results);
    }
    
    async getTransactionByCertificate(
        ctx: LandContext, 
        certificate: string
    ) {
		

        let query = new QueryUtils(ctx, TRANSFERLIST);
        let results = await query.getRecordByQueryObject({
            certificate: certificate
        });
        console.log(results);
        return JSON.stringify(results);
    }
}

