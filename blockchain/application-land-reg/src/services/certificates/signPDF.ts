import fs, { PathLike } from 'fs';

const signer = require('node-signpdf');
const plainAddPlaceholder = require('node-signpdf/helpers/plainAddPlaceHolder');

export default function signPDF(pdfPath: PathLike, p12cert: PathLike) {
    const p12Buffer = fs.readFileSync(p12cert);
    let pdfBuffer = fs.readFileSync(pdfPath);
    pdfBuffer = plainAddPlaceholder({
        pdfBuffer,
        reason: 'To verify',
        signatureLength: 1612,
    });
    pdfBuffer = signer.sign(pdfBuffer, p12Buffer);

    fs.writeFileSync(pdfPath, pdfBuffer);
}
