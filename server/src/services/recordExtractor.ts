import { ILandRecord, ILandTransfer } from '../interfaces/blockchainInterfaces';
import { queryAllVillageRecords } from '../blockchain/queryVillageRecords';
import { IResolvedCoordInfo } from '../interfaces/coordResolverInterfaces';
import { queryOwnershipHistory } from '../blockchain/queryOwnershipHistory' 
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
             throw new Error("Corresponding land entry not found.");
        }
        
        let ownershipHistory: Array<ILandTransfer> = await queryOwnershipHistory(
            landRecord.khasraNo,
            landRecord.village,
            landRecord.subDistrict,
            landRecord.district,
            landRecord.state,
        );
        
        // Extract latest transaction from ownershipHistory 

    }
}