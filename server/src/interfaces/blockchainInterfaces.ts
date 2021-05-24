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
    polygonPoints: Array<IPoint>;
    area: Number;
    owner: IOwner;
    parentLandKey: string | null;
    certificate: string;
    otherDocs: Array<string>;
    expired: Boolean;
}

export interface ILandTransfer {
    price: Number;
    timestamp: Number;
    landKey: string;
    prevOwner: IOwner;
    newOwner: IOwner;
    certificate: string;
    otherDocs: Array<string>;
}

export interface IOwnershipHistory {
    land: ILandRecord;
    transferHistory: Array<ILandTransfer>;
}
