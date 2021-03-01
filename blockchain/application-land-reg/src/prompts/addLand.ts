import inquirer from 'inquirer';
import { addLand } from '../transactions/addLand';
import { IPoint } from '../../../contract/src/land';
import {
    validateEmpty,
    validateNumbers,
    getIPointArray,
    getPointQuestions,
} from './utils';

export async function promptAddLand() {
    const quesListAddLand = [
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
            name: 'khatatNo',
            message: 'Enter Khata Number',
            ...validateNumbers(),
        },
        {
            name: 'owner',
            message: 'Enter Owner Name',
            ...validateEmpty(),
        },
        {
            type: 'text',
            name: 'area',
            message: 'Enter Area in sq m',
            ...validateNumbers(),
        },
        {
            type: 'text',
            name: 'numPts',
            message: 'Enter number of Polygon Points',
            ...validateNumbers(),
        },
    ];

    let results = await inquirer.prompt(quesListAddLand);

    let quesPolyPtsAr = getPointQuestions(results.numPts);

    let ptsAnswers = await inquirer.prompt(quesPolyPtsAr);
    let pts: Array<IPoint> = getIPointArray(ptsAnswers, results.numPts);

    await addLand(
        results.khasraNo,
        results.village,
        results.subDistrict,
        results.district,
        results.state,
        pts,
        results.area,
        results.khatatNo,
        results.owner,
    );
}
