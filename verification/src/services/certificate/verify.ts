import { Request } from 'express';
import { queryLand } from '../transactions/queryLand'
import { queryOwnershipHistory } from '../transactions/queryOwnershipHistory';


async function verifyCertificate(req: Request){

    const { 
        khasraNo, 
        village,
        subDistrict,
        district,
        state, 
        hash, 
        hashType 
    } = req.body


    if (
        !hash || 
        !hashType || 
        !isDataValid(
            khasraNo, 
            village, 
            subDistrict, 
            district, 
            state
        )
    ) {
        throw new Error('Invalid Data')
    }
    
    let certificate = '';

    if(hashType=='LAND'){
        
        const record = await queryLand(
            khasraNo,
            village,
            subDistrict,
            district,
            state,
        );
        
        if(!record){
            throw new Error("Record doesnot exist");
        }

        certificate = record.certificate;
    
    }
    else if(hashType=='TRANSACTION'){
        
        const response = await queryOwnershipHistory(
            khasraNo,
            village,
            subDistrict,
            district,
            state,
        );
        
        if(!response.length){
            throw new Error("Record doesnot exist");
        }

        for(const land of response){
            if(land[1]){
                const result =land[1].filter((history: any) => history.Record.certificate==hash);
                console.log("!!", result);
                if(result[0]){
                    certificate = result[0].Record.certificate ;
                    break;
                }
            }
        }
    }
    else{
        throw new Error("Invalid record type")
    }
    
    if(certificate != hash){
         throw new Error("Certificate hash not associated with the given record");
    }
}


function isDataValid(
    khasraNo: any,
    village: any,
    subDistrict: any,
    district: any,
    state: any,
) {
    const khasraRe = new RegExp('^[0-9]+(/[0-9]+)*$');
    const nameRe = new RegExp('^[a-zA-Z][a-zA-Z ]*$');

    if (
        !khasraRe.test(khasraNo) ||
        !nameRe.test(village) ||
        !nameRe.test(subDistrict) ||
        !nameRe.test(district) ||
        !nameRe.test(state)
    )
        return false;

    return true;
}


export default verifyCertificate;
