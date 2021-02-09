import {
    LandRecord,
    TransferLandTxn,
} from '../interfaces/blockchainInterfaces';
import pdfmake from 'pdfmake';
import fs, { PathLike } from 'fs';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

export class LandRecordExtractor {
    getTableRowFromTxn(transaction: TransferLandTxn): Array<String> {
        let row = [];
        row.push(
            `${transaction.timestamp.getDate()}/${transaction.timestamp.getMonth() +
                1}/${transaction.timestamp.getFullYear()}`,
        );
        row.push('₹ ' + transaction.price.toString());
        row.push(transaction.prevKhataOwner);
        row.push(transaction.newKhataOwner);
        return row;
    }

    generatePDF(
        landRecord: LandRecord,
        transactions: Array<TransferLandTxn>,
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
                                    text: `Current Owner :- ${landRecord.khataOwner}`,
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
