import { IResolvedCoordInfo } from '../interfaces/coordResolverInterfaces';
import fs from 'fs';
import path from 'path';
import { isPointInPolygon } from 'geolib';

const locData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data.json'), 'utf8'),
);

function findSubDivision(locationInfo: any, point: any) {
    let result: any = {};
    locationInfo.every((subD: any) => {
        if (isPointInPolygon(point, subD.points)) {
            result = subD;
            return false;
        }
        return true;
    });
    return result;
}

export function resolveCoords(lat: any, lon: any): Promise<IResolvedCoordInfo> {
    const result: IResolvedCoordInfo = {
        point: {
            lat,
            lon,
        },
        country: '',
        state: '',
        district: '',
        subDistrict: '',
        village: '',
    };

    result.country = locData.name;
    result.point = {
        lat,
        lon,
    };

    console.log(locData);

    const state = findSubDivision(locData.subDivision, result.point);

    if (Object.keys(state).length === 0) {
        return Promise.resolve(result);
    }

    result.state = state.name;

    const district = findSubDivision(state.subDivision, result.point);

    if (Object.keys(district).length === 0) {
        return Promise.resolve(result);
    }

    result.district = district.name;

    const subDistrict = findSubDivision(district.subDivision, result.point);

    if (Object.keys(subDistrict).length === 0) {
        return Promise.resolve(result);
    }

    result.subDistrict = subDistrict.name;

    const village = findSubDivision(subDistrict.subDivision, result.point);

    if (Object.keys(village).length === 0) {
        return Promise.resolve(result);
    }

    result.village = village.name;

    return Promise.resolve(result);
}
