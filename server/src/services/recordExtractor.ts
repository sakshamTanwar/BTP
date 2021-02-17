import { ILandRecord, ILandTransfer } from '../interfaces/blockchainInterfaces';
import { queryAllVillageRecords } from '../blockchain/queryVillageRecords';
import { IResolvedCoordInfo } from '../interfaces/coordResolverInterfaces';
import {AppError} from "../utils/error"
import { isPointInPolygon } from 'geolib'

export class LandRecordExtractor{
    
    static async extractLandRecordFromBL(coordInfo: IResolvedCoordInfo){

        let records: Array<ILandRecord> = await queryAllVillageRecords(
            coordInfo.village,
            coordInfo.subDistrict,
            coordInfo.district,
            coordInfo.state
        );
        
        let landRecord: ILandRecord | null = null;

        for(const record of records){

            if(isPointInPolygon( coordInfo.point, record.polygonPoints)){
                landRecord = record;
                break;
            }
        }

        if(!landRecord){
             throw new AppError(404, "record_not_found", "Corresponding land entry doesnot exists.");
        }
        
        return landRecord;

    }
}