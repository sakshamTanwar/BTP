import fs, { PathLike } from 'fs'
// @ts-ignore
import { plainAddPlaceholder } from '../../../node_modules/node-signpdf/dist/helpers'
// @ts-ignore
import signer from 'node-signpdf'

export default function signPDF(pdfBuffer: Buffer, p12cert: string) {
	const p12Buffer = fs.readFileSync(p12cert)
	// let pdfBuffer = fs.readFileSync(pdfPath);
	pdfBuffer = plainAddPlaceholder({
		pdfBuffer,
		reason: 'Certificate is validated',
		signatureLength: 1612,
	})
	pdfBuffer = signer.sign(pdfBuffer, p12Buffer)
	return pdfBuffer
	// fs.writeFileSync(pdfPath, pdfBuffer);
}
