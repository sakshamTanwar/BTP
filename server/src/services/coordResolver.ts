import fetch from "node-fetch"

export function resolveCoords(lat:any, long:any){
    const api_url = `https://us1.locationiq.com/v1/reverse.php?key=pk.f290968746686314a1c4977840cc0353&lat=${lat}&lon=${long}&format=json`;
    return new Promise((resolve, reject) => {
        fetch(api_url)
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
      });
}