import inquirer from 'inquirer';
import { splitLand } from '../transactions/splitLand';
import {
    validateEmpty,
    validateNumbers,
    getPointQuestions,
    getIPointArray,
} from './utils';

export async function promptSplitLand() {
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
            name: 'newKhasraNoA',
            message: 'Enter Khasra Number for 1st part',
            ...validateEmpty(),
        },
        {
            name: 'newKhasraNoB',
            message: 'Enter Khasra Number for 2nd part',
            ...validateEmpty(),
        },
        {
            name: 'newAreaA',
            message: 'Enter area for 1st part',
            ...validateNumbers(),
        },
        {
            name: 'newAreaB',
            message: 'Enter area for 2nd part',
            ...validateNumbers(),
        },
        {
            name: 'numPtsA',
            message: 'Enter number of polygon points for 1st part',
            ...validateNumbers(),
        },
        {
            name: 'numPtsB',
            message: 'Enter number of polygon points for 2nd part',
            ...validateNumbers(),
        },
    ];

    let results = await inquirer.prompt(quesList);

    console.log('Enter points for 1st land');
    let ptsQuesA = getPointQuestions(results.numPtsA);
    let ptsA = await inquirer.prompt(ptsQuesA);
    ptsA = getIPointArray(ptsA, results.numPtsA);

    console.log('Enter points for 2st land');
    let ptsQuesB = getPointQuestions(results.numPtsB);
    let ptsB = await inquirer.prompt(ptsQuesB);
    ptsB = getIPointArray(ptsB, results.numPtsB);

    await splitLand(
        results.khasraNo,
        results.village,
        results.subDistrict,
        results.district,
        results.state,
        results.newKhasraNoA,
        ptsA,
        results.newAreaA,
        results.newKhasraNoB,
        ptsB,
        results.newAreaB,
    );
}
