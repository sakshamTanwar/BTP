import FabricCAServices from 'fabric-ca-client';
import { Wallets } from 'fabric-network';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

export async function enrollUser() {
    try {
        const yamlFile = path.join(
            process.cwd(),
            '../gateway/connection-org2.yaml',
        );
        let connectionProfile: any = yaml.load(
            fs.readFileSync(yamlFile, 'utf8'),
        );

        const caInfo =
            connectionProfile.certificateAuthorities['ca.org2.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(
            caInfo.url,
            { trustedRoots: caTLSCACerts, verify: false },
            caInfo.caName,
        );

        const walletPath = path.join(
            process.cwd(),
            '../identity/user/isabella/wallet',
        );
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        const userExists = await wallet.get('isabella');
        if (userExists) {
            console.log(
                'An identity for the client user "isabella" already exists in the wallet',
            );
            return;
        }

        const enrollment = await ca.enroll({
            enrollmentID: 'user1',
            enrollmentSecret: 'user1pw',
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org2MSP',
            type: 'X.509',
        };
        await wallet.put('isabella', x509Identity);
        console.log(
            'Successfully enrolled client user "isabella" and imported it into the wallet',
        );
    } catch (error) {
        console.error(`Failed to enroll client user "isabella": ${error}`);
        process.exit(1);
    }
}
enrollUser();
