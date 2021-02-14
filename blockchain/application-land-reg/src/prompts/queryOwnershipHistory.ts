import inquirer from 'inquirer';
import { queryOwnershipHistory } from '../transactions/queryOwnershipHistory';
import { validateEmpty } from './utils';

export async function promptOwnershipHistory() {
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
    ];

    let results = await inquirer.prompt(quesList);

    await queryOwnershipHistory(
        results.khasraNo,
        results.village,
        results.subDistrict,
        results.district,
        results.state,
    );
}
