import { IPoint } from "./blockchainInterfaces";

export interface IResolvedCoordInfo {
    point: IPoint
    country: string;
    state: string;
    district: string;
    subDistrict: string;
    village: string;
}