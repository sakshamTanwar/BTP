import inquirer from 'inquirer';
import { queryAllVillageRecords } from '../transactions/queryAllVillageRecords';
import { validateEmpty } from './utils';

export async function promptQueryVillage() {
    const quesList = [
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
    ];

    let results = await inquirer.prompt(quesList);

    await queryAllVillageRecords(
        results.village,
        results.subDistrict,
        results.district,
        results.state,
    );
}
