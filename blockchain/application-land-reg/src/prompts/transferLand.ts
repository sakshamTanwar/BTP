import inquirer from 'inquirer';
import { transferLand } from '../transactions/transferLand';
import { validateEmpty, validateNumbers, promptAndUploadFiles } from './utils';

export async function promptTransferLand() {
    const quesList = [
        {
            name: 'khasraNo',
            message: 'Enter Khasra Number',
            ...validateEmpty(),
        },
        {
            name: 'village',
            message: 'Enter Village',
            ...validateEmpty(),
        },
        {
            name: 'subDistrict',
            message: 'Enter Sub-District',
            ...validateEmpty(),
        },
        {
            name: 'district',
            message: 'Enter District',
            ...validateEmpty(),
        },
        {
            name: 'state',
            message: 'Enter State',
            ...validateEmpty(),
        },
        {
            type: 'text',
            name: 'curKhatatNo',
            message: 'Enter Current Khata Number',
            ...validateNumbers(),
        },
        {
            name: 'curOwner',
            message: 'Enter Current Owner Name',
            ...validateEmpty(),
        },
        {
            type: 'text',
            name: 'newKhataNo',
            message: 'Enter New Khata Number',
            ...validateNumbers(),
        },
        {
            name: 'newOwner',
            message: 'Enter New Owner Name',
            ...validateEmpty(),
        },
        {
            type: 'text',
            name: 'price',
            message: 'Enter Sale Price',
            ...validateNumbers(),
        },
    ];

    let results = await inquirer.prompt(quesList);

    // TODO generate certificate
    let certificate = ' ';

    const otherDocs = await promptAndUploadFiles(
        'Enter number of additional files',
    );

    await transferLand(
        results.khasraNo,
        results.village,
        results.subDistrict,
        results.district,
        results.state,
        results.curKhatatNo,
        results.curOwner,
        results.newKhataNo,
        results.newOwner,
        results.price,
        new Date(),
        certificate,
        otherDocs,
    );
}
