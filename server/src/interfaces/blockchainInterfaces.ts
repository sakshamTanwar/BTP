export interface IPoint {
    lat: number;
    lon: number;
}

export interface IOwner {
    khataNo: Number;
    name: string;
}

export interface ILandRecord {
    khasraNo: string;
    village: string;
    subDistrict: string;
    district: string;
    state: string;
    landID: string;
    polygonPoints: Array<IPoint>;
    area: Number;
    owner: IOwner;
    parentLandLastTxnID: string | null;
}

export interface ILandTransfer {
    txnID: string;
    price: Number;
    timestamp: Number;
    landID: string;
    prevOwner: IOwner;
    newOwner: IOwner;
    lastTxnID: string;
    landRecordTxnID: string;
}

export interface IOwnershipHistory {
    land: ILandRecord;
    transferHistory: Array<ILandTransfer>;
}
