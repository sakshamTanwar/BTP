import fetch from 'node-fetch';
import { IResolvedCoordInfo } from '../interfaces/coordResolverInterfaces';

export function resolveCoords(lat: any, lon: any): Promise<IResolvedCoordInfo> {
    // const api_key = "pk.f290968746686314a1c4977840cc0353";
    // const api_url = `https://us1.locationiq.com/v1/reverse.php?key=${api_key}&lat=${lat}&lon=${lon}&format=json`;

    const api_key = 'nup6q766plnyngyj17u844z79fzjc45y';
    const api_url = `https://apis.mapmyindia.com/advancedmaps/v1/${api_key}/rev_geocode?lat=${lat}&lng=${lon}`;

    return new Promise((resolve, reject) => {
        fetch(api_url)
            .then(res => res.json())
            .then(data => {
                data = data.results[0];
                let district = [
                    ...data.district.matchAll(/(?<Name>[a-zA-Z]*) District/g),
                ][0].groups.Name;
                let resolvedInfo: IResolvedCoordInfo = {
                    point: {
                        lat: lat,
                        lon: lon,
                    },

                    country: data.area.toLowerCase(),
                    state: data.state.toLowerCase(),
                    district: district.toLowerCase(),
                    subDistrict: data.subDistrict.toLowerCase(),
                    village: data.village.toLowerCase(),
                };

                return resolve(resolvedInfo);
            })
            .catch(err => reject(err));
    });
}
