import PdfPrinter from 'pdfmake';
import { ILand } from '../../../../contract/src/land';
import { PathLike } from 'fs';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import fs from 'fs';
import signPDF from './signPDF';

const fonts = {
    Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf',
    },
};

export default async function generateCertificate(
    land: ILand,
    p12Cert: PathLike,
    savePath: PathLike,
) {
    await generatePDF(land, savePath);
    signPDF(savePath, p12Cert);
}

function toTitleCase(phrase: string) {
    return phrase
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function generatePDF(land: ILand, savePath: PathLike) {
    let docDefinition: TDocumentDefinitions = getDocDefinition(land);

    const pdfDoc = new PdfPrinter(fonts).createPdfKitDocument(docDefinition);
    const writeStream = fs.createWriteStream(savePath);
    pdfDoc.pipe(writeStream);
    pdfDoc.end();
    return new Promise<void>((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
    });
}

function getDocDefinition(land: ILand): TDocumentDefinitions {
    return {
        header: 'Digitally Signed by Land Registration Department',
        content: [
            {
                text: 'Land Record',
                fontSize: 15,
                alignment: 'center',
            },
            {
                text: [
                    {
                        text: 'Khasra No: ',
                        bold: true,
                    },
                    land.khasraNo,
                ],
            },
            {
                text: [
                    {
                        text: 'Village: ',
                        bold: true,
                    },
                    toTitleCase(land.village),
                ],
            },
            {
                text: [
                    {
                        text: 'Sub-District: ',
                        bold: true,
                    },
                    toTitleCase(land.subDistrict),
                ],
            },
            {
                text: [
                    {
                        text: 'District: ',
                        bold: true,
                    },
                    toTitleCase(land.district),
                ],
            },
            {
                text: [
                    {
                        text: 'State: ',
                        bold: true,
                    },
                    toTitleCase(land.state),
                ],
            },
            {
                text: [
                    {
                        text: 'Area: ',
                        bold: true,
                    },
                    `${land.area.toString()} sq m`,
                ],
            },
            {
                text: [
                    {
                        text: 'Khata No: ',
                        bold: true,
                    },
                    `${land.owner.khataNo.toString()}`,
                ],
            },
            {
                text: [
                    {
                        text: 'Owner Name: ',
                        bold: true,
                    },
                    land.owner.name,
                ],
            },
        ],
    };
}
