import { Request } from 'express';
import { queryCertificate } from '../transactions/queryCertificate';

async function verifyCertificate(hash: string, certType: string){

    if (!hash) {
        throw new Error('Invalid Data');
    }

    const response = await queryCertificate(
        hash,
        certType
    );
    
    console.log(response);
    return response;
}

export default verifyCertificate;
