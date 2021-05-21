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
        const body = [
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
        ];

        if (transaction.otherDocs.length > 0) {
            body.push([
                {
                    text: this.getTextWithBoldHeading(
                        'Other Documents :- ',
                        '',
                    ),
                    colSpan: 4,
                },
            ]);

            transaction.otherDocs.forEach((docCID: string) => {
                body.push([
                    {
                        text: docCID,
                        colSpan: 4,
                    },
                ] as any);
            });
        }

        return {
            layout: 'noBorders',
            table: {
                headerRows: 0,
                widths: ['*', '*', '*', '*'],
                body: body,
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

    private static getGenesisTxnRow(
        landRecord: ILandRecord,
        ownerName: string,
    ) {
        let row = [];
        row.push('0');

        row.push({
            layout: 'noBorders',
            table: {
                headerRows: 0,
                widths: ['*', '*'],
                body: [
                    [
                        this.getTextWithBoldHeading(
                            'Khasra No :- ',
                            landRecord.khasraNo,
                        ),
                        this.getTextWithBoldHeading('Owner :- ', ownerName),
                    ],
                ],
            },
        });

        return row;
    }

    static toTitleCase(phrase: string) {
        return phrase
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
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

        history.forEach(
            (
                record: IOwnershipHistory,
                index: number,
                arr: IOwnershipHistory[],
            ) => {
                record.transferHistory.sort((a, b) => {
                    return (b.timestamp as number) - (a.timestamp as number);
                });
                transactions.push(...record.transferHistory);
                record.transferHistory.reverse();
                arr[index] = record;
            },
        );

        transactions.reverse();

        let genesisOwnerName = '';

        console.log(JSON.stringify(history, null, 4));

        if (history[history.length - 1].transferHistory.length === 0) {
            genesisOwnerName = history[history.length - 1].land.owner.name;
        } else {
            genesisOwnerName =
                history[history.length - 1].transferHistory[0].prevOwner.name;
        }

        rows.push(
            this.getGenesisTxnRow(
                history[history.length - 1].land,
                genesisOwnerName,
            ),
        );

        for (let i = 0; i < transactions.length; i++) {
            rows.push(this.getTableRowFromTxn(transactions[i], i + 1));
        }

        const landInfoTableBody = [
            [
                this.getTextWithBoldHeading(
                    'Khasra No :- ',
                    landRecord.khasraNo,
                ),
                this.getTextWithBoldHeading(
                    'Village :- ',
                    this.toTitleCase(landRecord.village),
                ),
                this.getTextWithBoldHeading(
                    'Sub-District :- ',
                    this.toTitleCase(landRecord.subDistrict),
                ),
            ],
            [
                this.getTextWithBoldHeading(
                    'District :-',
                    this.toTitleCase(landRecord.district),
                ),
                this.getTextWithBoldHeading(
                    'State :- ',
                    this.toTitleCase(landRecord.state),
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
        ];

        if (landRecord.otherDocs.length > 0) {
            landInfoTableBody.push([
                {
                    text: this.getTextWithBoldHeading(
                        'Other Documents :- ',
                        '',
                    ),
                    colSpan: 3,
                },
            ]);

            landRecord.otherDocs.forEach((docCID: string) => {
                landInfoTableBody.push([
                    {
                        text: docCID,
                        colSpan: 3,
                    },
                ] as any);
            });
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
                        body: landInfoTableBody,
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
