import express, { Request, Response, NextFunction } from 'express';
import { DbConnection } from './setup/db';
// import session from "express-session"
import passport from 'passport';
import passportInit from './setup/passport';
import indexRouter from './routes/index';
import landrecordRouter from './routes/landrecord';
import paymentRouter from './routes/payment';
import bodyParser from 'body-parser';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import https from 'https';
import http from 'http';
import fs from 'fs';
import { enrollUser } from './blockchain/enrollUser';

require('dotenv').config();
passportInit(passport);

enrollUser();
const app = express();
const port = 8080; // default port to listen
const httpsPort = 8081;

//Establish DB Connection
DbConnection.connect();

//Middlewares

const upload = multer();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.none());
app.use(cors());
// app.use(session({secret: "SESSION_KEY"})); // Randomize it later
app.use(passport.initialize());
// app.use(passport.session());

//Set Routes
app.use('/', indexRouter);
app.use('/landrecord', landrecordRouter);
app.use('/payment', paymentRouter);

//Error Handler Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = err.statusCode || 500;
    let errorCode = err.error || 'server_err';
    let message = err.message || 'Internal Server Error';
    res.status(statusCode).send({
        success: false,
        error: {
            code: errorCode,
            message: message,
        },
    });
});

// const options = {
//     key: fs.readFileSync(path.join(__dirname,'..','ssl','key.pem')),
//     cert: fs.readFileSync(path.join(__dirname,'..','ssl','cert.pem'))
// };

// start the Express server
// https.createServer(options, app).listen(443);

console.log(`Creating HTTP server at port ${port}`);
let server = http.createServer(app).listen(port);

if (process.env.SSLKEY && process.env.SSLCERT) {
    let sslOptions = {
        key: fs.readFileSync(process.env.SSLKEY),
        cert: fs.readFileSync(process.env.SSLCERT),
    };
    console.log(`Creating HTTPS server at port ${httpsPort}`);
    let serverHttps = https.createServer(sslOptions, app).listen(httpsPort);
}
