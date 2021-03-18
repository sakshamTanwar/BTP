import express from 'express'
import verifyCertificate from '../services/certificate/verify'
import signPDF from '../services/certificate/signPDF'
import path from 'path'

const uint8ArrayConcat = require('uint8arrays/concat')

const IpfsHttpClient = require('ipfs-http-client')
const { CID } = IpfsHttpClient

const stream = require('stream')
const readStream = new stream.PassThrough()

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
		const { hash } = req.body
		if(!hash){
			throw new Error("Invalid Hash");
		}
		
		let certRecord = await verifyCertificate(hash, 'LAND');
		if(certRecord.length==0){
			throw new Error("Invalid Hash");
		}

		const node = IpfsHttpClient()
		const chunks: Uint8Array[] = []

		for await (const chunk of node.cat(new CID(hash))) {
			chunks.push(chunk)
		}
	
		let pdfBuffer = Buffer.concat(chunks); 
		let signedPdfBuffer = signPDF(pdfBuffer, path.join(__dirname,'..','..','certificate.p12'));

		readStream.end(signedPdfBuffer)
		res.set('Content-Type', 'application/pdf')
		readStream.pipe(res)
		
	} catch (err) {
		next(err)
	}
})

export default router
