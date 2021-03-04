import { IPoint } from '../../../contract/src/land';
import inquirer from 'inquirer';
import fs from 'fs';
import { uploadFile } from '../ipfs/uploadFile';

inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'));

export function validateEmpty() {
    return {
        validate: (input: string) => {
            if (!input || 0 === input.length) {
                return 'Input cannot be empty';
            }
            return true;
        },
    };
}

export function validateNumbers() {
    return {
        validate: (input: string) => {
            const numberInput = Number(input);

            if (0 === input.length || isNaN(numberInput) || numberInput < 0) {
                return 'Enter a valid number';
            }

            return true;
        },
        filter: (input: string) => {
            const numberInput = Number(input);

            if (0 === input.length || isNaN(numberInput) || numberInput < 0) {
                return input;
            }

            return numberInput;
        },
    };
}

export function getIPointArray(
    promptAns: { [key: string]: any },
    pointCnt: number,
) {
    let pts: Array<IPoint> = [];

    for (let i = 0; i < pointCnt; i++) {
        pts.push({
            lat: promptAns['lat' + i.toString()],
            lon: promptAns['long' + i.toString()],
        });
    }

    return pts;
}

export function getPointQuestions(pointCnt: Number) {
    let result = [];
    for (let i = 0; i < pointCnt; i++) {
        const quesPolyPts = [
            {
                type: 'text',
                name: 'lat' + i.toString(),
                message: 'Enter Latitude for point ' + (i + 1).toString(),
                ...validateNumbers(),
            },
            {
                type: 'text',
                name: 'long' + i.toString(),
                message: 'Enter Longitude for point ' + (i + 1).toString(),
                ...validateNumbers(),
            },
        ];
        result.push(...quesPolyPts);
    }

    return result;
}

function getFilePrompt(name: string, msg: string) {
    return {
        type: 'fuzzypath',
        name: name,
        excludePath: (nodePath: string) => nodePath.startsWith('node_modules'),
        excludeFilter: (nodePath: string) => nodePath == '.',
        itemType: 'file',
        rootPath: './',
        message: msg,
        suggestOnly: false,
        depthLimit: 5,
    };
}

async function getFileInput(name: string, msg: string) {
    let n = await inquirer.prompt([
        {
            type: 'text',
            name: 'numFiles',
            message: msg,
            ...validateNumbers(),
        },
    ]);
    n = n.numFiles;
    let ques = [];
    for (let i = 1; i <= n; i++) {
        let prompt = getFilePrompt(
            name + i.toString(),
            `Enter path to file ${i.toString()}`,
        );
        ques.push(prompt);
    }

    let promptAns = await inquirer.prompt(ques);

    let results: Array<string> = [];

    for (let i = 1; i <= n; i++) {
        results.push(promptAns[name + i.toString()]);
    }

    return results;
}

export async function promptAndUploadFiles(promptMsg: string) {
    let files = await getFileInput('otherDocs', promptMsg);

    if (
        !files.every(filePath => {
            return fs.existsSync(filePath);
        })
    ) {
        throw Error('One or more added file(s) do not exist');
    }

    let otherDocs: Array<string> = [];

    for (const filePath of files) {
        let result = await uploadFile(filePath);
        otherDocs.push((result as { [key: string]: any }).cid.toString());
    }

    return otherDocs;
}
