import fetch from "node-fetch"
import { IResolvedCoordInfo } from "../interfaces/coordResolverInterfaces";

export function resolveCoords(lat:any, lon:any){
    
    const api_key = "pk.f290968746686314a1c4977840cc0353";
    const api_url = `https://us1.locationiq.com/v1/reverse.php?key=${api_key}&lat=${lat}&lon=${lon}&format=json`;
   
    return new Promise((resolve, reject) => {
        
        fetch(api_url)
        .then(res => res.json())
        .then(data => {

            let resolvedInfo: IResolvedCoordInfo = {
                point: {
                    lat: lat,
                    lon: lon
                },
                country: data.address.country,
                state: data.address.state,
                district: data.address.state_district,
                subDistrict: data.address.county,
                village: data.address.village,
            }       
                
            console.log(resolvedInfo.village);
            return resolve(resolvedInfo);
            
         })
        .catch(err => reject(err));
      });
}