import { ILandRecord, ILandTransfer } from '../interfaces/blockchainInterfaces';
import pdfmake from 'pdfmake';
import fs, { PathLike } from 'fs';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

export class LandRecordExtractor {
    getTableRowFromTxn(transaction: ILandTransfer): Array<String> {
        let row = [];
        let txnTimeStamp = new Date(transaction.timestamp as number);
        row.push(
            `${txnTimeStamp.getDate()}/${txnTimeStamp.getMonth() +
                1}/${txnTimeStamp.getFullYear()}`,
        );
        row.push('₹ ' + transaction.price.toString());
        row.push(transaction.prevOwner.name);
        row.push(transaction.newOwner.name);
        return row;
    }

    generatePDF(
        landRecord: ILandRecord,
        transactions: Array<ILandTransfer>,
        saveFile: PathLike,
    ) {
        const fonts = {
            Roboto: {
                normal: 'fonts/Roboto-Regular.ttf',
                bold: 'fonts/Roboto-Medium.ttf',
                italics: 'fonts/Roboto-Italic.ttf',
                bolditalics: 'fonts/Roboto-MediumItalic.ttf',
            },
        };

        const headers: any = [['Date', 'Price', 'Seller', 'Buyer']];

        const docDefinition: TDocumentDefinitions = {
            content: [
                {
                    text: 'Land Ownership History',
                    alignment: 'center',
                    fontSize: 20,
                    bold: true,
                },
                {
                    text: '\n\n\nLand Parcel:-\n\n',
                    bold: true,
                    fontSize: 15,
                },
                {
                    layout: 'noBorders',
                    table: {
                        headerRows: 0,
                        widths: ['*', '*', '*'],
                        body: [
                            [
                                `Khasra No :- ${landRecord.khasraNo}`,
                                `Village :- ${landRecord.village}`,
                                `Sub-District :- ${landRecord.subDistrict}`,
                            ],
                            [
                                `District :- ${landRecord.district}`,
                                `State :- ${landRecord.state}`,
                                `Area :- ${landRecord.area} sq m`,
                            ],
                            [
                                {
                                    text: `Current Owner :- ${landRecord.owner.name}`,
                                    colSpan: 3,
                                },
                            ],
                        ],
                    },
                },
                {
                    text: '\n\n\nOwnership History :- \n\n',
                    bold: true,
                    fontSize: 15,
                },
                {
                    layout: 'headerLineOnly',
                    table: {
                        headerRows: 1,
                        widths: ['*', '*', '*', '*'],
                        body: headers.concat(
                            transactions.map(this.getTableRowFromTxn),
                        ),
                    },
                },
            ],
        };

        const printer = new pdfmake(fonts);
        let pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(fs.createWriteStream(saveFile));
        pdfDoc.end();
    }
}
