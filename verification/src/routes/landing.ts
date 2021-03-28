import express from 'express'
import verifyCertificate from '../services/certificate/verify'
import signPDF from '../services/certificate/signPDF'
import path from 'path'

const uint8ArrayConcat = require('uint8arrays/concat')

const IpfsHttpClient = require('ipfs-http-client')
const { CID } = IpfsHttpClient

const stream = require('stream')

const router = express.Router()

router.use(express.json())
router.use(
	express.urlencoded({
		extended: true,
	}),
)

router.get(`/`, (_, res) => {
	res.render(`landing.ejs`)
})

router.post(`/`, async (req, res, next) => {
	try {

		await verifyCertificate(req)
        
		const { hash } = req.body;	
		const node = IpfsHttpClient()		
		const chunks: Uint8Array[] = []

		for await (const chunk of node.cat(new CID(hash))) {
			chunks.push(chunk)
		}

		let pdfBuffer = Buffer.concat(chunks)
		let signedPdfBuffer = signPDF(pdfBuffer, process.env.CERT)
		const readStream = new stream.PassThrough()
		readStream.end(signedPdfBuffer)
		res.set('Content-Type', 'application/pdf')
		readStream.pipe(res)
		
	} catch (err) {
		res.render('landing.ejs', { errorMsg: err.message })
	}
})

export default router
