import {
    IOwnershipHistory,
    ILandRecord,
    ILandTransfer,
} from '../interfaces/blockchainInterfaces';
import pdfmake from 'pdfmake';
import fs, { PathLike } from 'fs';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

export class PDFGenerator {
    private static getSubTableForTxn(transaction: ILandTransfer) {
        let txnTimeStamp = new Date(transaction.timestamp as number);
        return {
            layout: 'noBorders',
            table: {
                headerRows: 0,
                widths: ['*', '*', '*', '*'],
                body: [
                    [
                        this.getTextWithBoldHeading(
                            'Khasra No :- ',
                            transaction.landKey.slice(
                                transaction.landKey.lastIndexOf(':') + 1,
                            ),
                        ),
                        this.getTextWithBoldHeading(
                            'Date :- ',
                            `${txnTimeStamp.getDate()}/${txnTimeStamp.getMonth() +
                                1}/${txnTimeStamp.getFullYear()}`,
                        ),
                        this.getTextWithBoldHeading(
                            'Seller :- ',
                            transaction.prevOwner.name,
                        ),
                        this.getTextWithBoldHeading(
                            'Buyer :- ',
                            transaction.newOwner.name,
                        ),
                    ],
                    [
                        {
                            text: this.getTextWithBoldHeading(
                                'Verification Code :- ',
                                transaction.certificate,
                            ),
                            colSpan: 4,
                        },
                    ],
                ],
            },
        };
    }

    private static getTableRowFromTxn(
        transaction: ILandTransfer,
        index: number,
    ): Array<any> {
        let row = [];
        row.push(index.toString());
        const subTable = this.getSubTableForTxn(transaction);
        row.push(subTable);
        return row;
    }

    private static getTextWithBoldHeading(heading: string, text: string) {
        return [
            {
                text: heading,
                bold: true,
            },
            {
                text: text,
            },
        ];
    }

    static generatePDF(history: Array<IOwnershipHistory>, saveFile: PathLike) {
        const fonts = {
            Roboto: {
                normal: 'fonts/Roboto-Regular.ttf',
                bold: 'fonts/Roboto-Medium.ttf',
                italics: 'fonts/Roboto-Italic.ttf',
                bolditalics: 'fonts/Roboto-MediumItalic.ttf',
            },
        };

        const rows: any = [
            [
                { text: 'S. No.', bold: true },
                { text: 'Transaction Details', bold: true },
            ],
        ];

        let landRecord: ILandRecord = history[0].land;
        let transactions: Array<ILandTransfer> = [];

        history.forEach((record: IOwnershipHistory) => {
            record.transferHistory.sort((a, b) => {
                return (b.timestamp as number) - (a.timestamp as number);
            });
            transactions.push(...record.transferHistory);
        });

        for (let i = 0; i < transactions.length; i++) {
            rows.push(this.getTableRowFromTxn(transactions[i], i + 1));
        }

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
                                this.getTextWithBoldHeading(
                                    'Khasra No :- ',
                                    landRecord.khasraNo,
                                ),
                                this.getTextWithBoldHeading(
                                    'Village :- ',
                                    landRecord.village,
                                ),
                                this.getTextWithBoldHeading(
                                    'Sub-District :- ',
                                    landRecord.subDistrict,
                                ),
                            ],
                            [
                                this.getTextWithBoldHeading(
                                    'District :-',
                                    landRecord.district,
                                ),
                                this.getTextWithBoldHeading(
                                    'State :- ',
                                    landRecord.state,
                                ),
                                this.getTextWithBoldHeading(
                                    'Area :- ',
                                    `${landRecord.area} sq m`,
                                ),
                            ],
                            [
                                {
                                    text: this.getTextWithBoldHeading(
                                        'Verification Code :- ',
                                        landRecord.certificate,
                                    ),
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
                    table: {
                        headerRows: 1,
                        widths: [45, '*'],
                        body: rows,
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
