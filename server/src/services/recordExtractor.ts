import { ILandRecord, ILandTransfer } from '../interfaces/blockchainInterfaces';
import { queryRecords } from '../blockchain/queryRecords';
import { IResolvedCoordInfo } from '../interfaces/coordResolverInterfaces';
import { AppError } from '../utils/error';
import { isPointInPolygon } from 'geolib';

export class LandRecordExtractor {
    static async extractLandRecordFromBL(coordInfo: IResolvedCoordInfo) {
        let records: Array<ILandRecord> = await queryRecords(
            coordInfo.village.toLowerCase(),
            coordInfo.subDistrict.toLowerCase(),
            coordInfo.district.toLowerCase(),
            coordInfo.state.toLowerCase(),
        );

        let landRecord: ILandRecord | null = null;

        for (const record of records) {
		console.log(record);
	    if (record.expired) continue;
            if (isPointInPolygon(coordInfo.point, record.polygonPoints)) {
                landRecord = record;
                break;
            }
        }

        if (!landRecord) {
            throw new AppError(
                404,
                'record_not_found',
                'Corresponding land entry doesnot exists.',
            );
        }

        return landRecord;
    }
}
