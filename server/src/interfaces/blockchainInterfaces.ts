interface Point {
    lat : Number,
    long : Number
}

export interface LandRecord {
    khasraNo: String,
    village: String,
    subDistrict : String,
    district : String,
    state : String,
    landID : String,
    polygonPoints : Array<Point>,
    area : Number,
    khataNo : Number,
    khataOwner : String,
    parentLandLastTxnID : String | null
}

export interface TransferLandTxn {
    txnID : String,
    price : Number,
    timestamp : Date,
    landID : String,
    prevKhataNo : Number,
    prevKhataOwner : String,
    newKhataNo : Number,
    newKhataOwner : String,
    lastTxnID : String,
    landRecordTxnID : String
}