import express from 'express'

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
		const node = IpfsHttpClient()
		const chunks: Uint8Array[] = []
		for await (const chunk of node.cat(new CID(hash))) {
			chunks.push(chunk)
		}
		readStream.end(uint8ArrayConcat(chunks))
		res.set('Content-Type', 'application/pdf')
		readStream.pipe(res)
	} catch (err) {
		next(err)
	}
})

export default router
