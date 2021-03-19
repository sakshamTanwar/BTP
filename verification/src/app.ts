import path from 'path'
import express, { NextFunction, Request, Response } from 'express'

import { LandingRouter } from './routes'

if (!process.env.CERT) {
	throw Error('Provide CERT environment variable with path to P12 Certificate to sign PDFs')
}

const app = express()
const port = process.env.port || 3030

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

app.listen(port, () => {
	console.log(`server started at http://localhost:${port}`)
})
