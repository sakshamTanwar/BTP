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
        row.push(transaction.timestamp.toLocaleString());
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
                    text: 'Land Parcel:-',
                    bold: true,
                    fontSize: 15,
                },
                {
                    text: `State :- ${landRecord.state}\nDistrict :- ${
                        landRecord.district
                    }\nSub-District :- ${landRecord.subDistrict}\nVillage :- ${
                        landRecord.village
                    }\nArea :- ${landRecord.area.toString()} m^2\n\n\n`,
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
