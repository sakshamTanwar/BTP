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
    let docDefinition: TDocumentDefinitions = getDocDefinition(land);

    const pdfDoc = new PdfPrinter(fonts).createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream(savePath));
    pdfDoc.end();

    signPDF(savePath, p12Cert);
}

function getDocDefinition(land: ILand): TDocumentDefinitions {
    return {
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
                    land.village,
                ],
            },
            {
                text: [
                    {
                        text: 'Sub-District: ',
                        bold: true,
                    },
                    land.subDistrict,
                ],
            },
            {
                text: [
                    {
                        text: 'District: ',
                        bold: true,
                    },
                    land.district,
                ],
            },
            {
                text: [
                    {
                        text: 'State: ',
                        bold: true,
                    },
                    land.state,
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
