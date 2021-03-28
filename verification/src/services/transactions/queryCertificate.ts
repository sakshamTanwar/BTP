import { submitTransaction } from './submitTransaction';

export async function queryCertificate(
    certificate: string,
    certType: string
) {

    let methodName = '';
    if(certType == 'LAND'){
        methodName = 'getLandByCertificate'
    }
    else if(certType == 'TRANSACTION'){
        methodName = 'getTransactionByCertificate'
    }
    else{
          throw new Error("Invalid Certificate Type");
    }
    
    return await submitTransaction(methodName, [
        certificate
    ]);
    
}
