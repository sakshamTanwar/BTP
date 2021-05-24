import path from 'path'
import http from 'http'
import https from 'https'
import fs from 'fs'
import express, { NextFunction, Request, Response } from 'express'

import { LandingRouter } from './routes'

if (!process.env.CERT) {
	throw Error('Provide CERT environment variable with path to P12 Certificate to sign PDFs')
}

const app = express()
const port = 3030
const httpsPort = 3031

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use('/bootstrap', express.static(path.join(__dirname, '../node_modules/bootstrap/dist')))
app.use('/jquery', express.static(path.join(__dirname, '../node_modules/jquery/dist')))

app.use('/', LandingRouter)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	const statusCode = err.statusCode || 500
	const errorCode = err.error || 'server_err'
	const message = err.message || 'Internal Server Error'
	res.status(statusCode).send({
		success: false,
		error: {
			code: errorCode,
			message: message,
		},
	})
})

console.log(`Creating HTTP server at port ${port}`)
let server = http.createServer(app).listen(port)

if (process.env.SSLKEY && process.env.SSLCERT) {
	let sslOptions = {
		key: fs.readFileSync(process.env.SSLKEY),
		cert: fs.readFileSync(process.env.SSLCERT),
	}
	console.log(`Creating HTTPS server at port ${httpsPort}`)
	let serverHttps = https.createServer(sslOptions, app).listen(httpsPort)
}
