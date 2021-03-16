import PdfPrinter from 'pdfmake';
import { ILandTransfer } from '../../../../contract/src/landtransfer';
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
    landTransfer: ILandTransfer,
    p12Cert: PathLike,
    savePath: PathLike,
) {
    await generatePDF(landTransfer, savePath);
    signPDF(savePath, p12Cert);
}

function generatePDF(landTransfer: ILandTransfer, savePath: PathLike) {
    let docDefinition: TDocumentDefinitions = getDocDefinition(landTransfer);

    const pdfDoc = new PdfPrinter(fonts).createPdfKitDocument(docDefinition);
    const writeStream = fs.createWriteStream(savePath);
    pdfDoc.pipe(writeStream);
    pdfDoc.end();
    return new Promise<void>((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
    });
}

function getDocDefinition(landTransfer: ILandTransfer): TDocumentDefinitions {
    const [
        state,
        district,
        subDistrict,
        village,
        khasraNo,
    ] = landTransfer.landKey.split(':');
    return {
        content: [
            {
                text: 'Land Transfer Record',
                fontSize: 15,
                alignment: 'center',
            },
            {
                text: [
                    {
                        text: 'Khasra No: ',
                        bold: true,
                    },
                    khasraNo,
                ],
            },
            {
                text: [
                    {
                        text: 'Village: ',
                        bold: true,
                    },
                    village,
                ],
            },
            {
                text: [
                    {
                        text: 'Sub-District: ',
                        bold: true,
                    },
                    subDistrict,
                ],
            },
            {
                text: [
                    {
                        text: 'District: ',
                        bold: true,
                    },
                    district,
                ],
            },
            {
                text: [
                    {
                        text: 'State: ',
                        bold: true,
                    },
                    state,
                ],
            },
            {
                text: [
                    {
                        text: 'Transfer Date: ',
                        bold: true,
                    },
                    `${new Date(
                        landTransfer.timestamp as number,
                    ).toDateString()}`,
                ],
            },
            {
                text: [
                    {
                        text: 'Seller Khata No: ',
                        bold: true,
                    },
                    `${landTransfer.prevOwner.khataNo.toString()}`,
                ],
            },
            {
                text: [
                    {
                        text: 'Seller Name: ',
                        bold: true,
                    },
                    landTransfer.prevOwner.name,
                ],
            },
            {
                text: [
                    {
                        text: 'Buyer Khata No: ',
                        bold: true,
                    },
                    `${landTransfer.newOwner.khataNo.toString()}`,
                ],
            },
            {
                text: [
                    {
                        text: 'Buyer Name: ',
                        bold: true,
                    },
                    landTransfer.newOwner.name,
                ],
            },
            {
                text: [
                    {
                        text: 'Price: ',
                        bold: true,
                    },
                    `${landTransfer.price.toString()}`,
                ],
            },
        ],
    };
}
