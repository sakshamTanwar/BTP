import { IPoint } from '../../../contract/src/land';

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
    pointCnt: Number,
) {
    let pts: Array<IPoint> = [];

    for (let i = 0; i < pointCnt; i++) {
        pts.push({
            lat: promptAns['lat' + i.toString()],
            long: promptAns['long' + i.toString()],
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
