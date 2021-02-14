import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import { Wallets, Gateway } from 'fabric-network';

export async function submitTransaction(txnName: string, args: Array<any>) {
    const walletPath = path.join(
        process.cwd(),
        '../identity/user/isabella/wallet',
    );
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const gateway = new Gateway();

    try {
        const userName = 'isabella';
        const yamlFile = path.join(
            process.cwd(),
            '../gateway/connection-org2.yaml',
        );
        let connectionProfile: any = yaml.load(
            fs.readFileSync(yamlFile, 'utf8'),
        );
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled: true, asLocalhost: true },
        };

        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);

        console.log('Use network channel: mychannel.');

        const network = await gateway.getNetwork('mychannel');

        console.log('Use landContract smart contract.');

        const contract = await network.getContract(
            'landcontract',
            'landContract',
        );

        console.log('Submitting transaction');

        const response = await contract.submitTransaction(txnName, ...args);

        console.log('Transaction Response :-');

        console.log(JSON.stringify(JSON.parse(response.toString()), null, 4));
    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
    } finally {
        console.log('Disconnection from gateway');
        gateway.disconnect();
    }
}
