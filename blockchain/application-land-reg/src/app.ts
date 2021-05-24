import express, { Request, Response, NextFunction } from 'express';
import { DbConnection } from './setup/db';
import passport from 'passport';
import passportInit from './setup/passport';
import path from 'path';
import formRouter from './routes/forms';
import indexRouter from './routes/index';
import session from 'express-session';
import http from 'http';
import https from 'https';
import fs from 'fs';
import { isAuth } from './utils/auth';
import { enrollUser } from './enrollUser';

if (!process.env.CERT) {
    throw Error(
        'Provide CERT environment variable with path to P12 Certificate to sign PDFs',
    );
}

if (!process.env.IPFS_CLUSTER) {
    throw Error(
        'Provide IPFS_CLUSTER environment variable with link to IPFS cluster node',
    );
}

enrollUser();

DbConnection.connect();
passportInit(passport);

const app = express();
const port = 8090;
const httpsPort = 8091;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(
    session({
        secret: 'SESSION_KEY',
        cookie: { maxAge: (1000 * 60 * 60) / 4 }, // session expires after 15 minutes
    }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
    '/bootstrap',
    express.static(
        path.join(__dirname, '../../../node_modules/bootstrap/dist'),
    ),
);
app.use(
    '/jquery',
    express.static(path.join(__dirname, '../../../node_modules/jquery/dist')),
);
app.use('/static', express.static(path.join(__dirname, './static/')));

app.use('/', indexRouter);
app.use('/form', isAuth, formRouter);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = err.statusCode || 500;
    let errorCode = err.error || 'server_err';
    let message = err.message || 'Internal Server Error';
    let stacktrace = err.stack || ' ';
    res.status(statusCode).send({
        success: false,
        error: {
            code: errorCode,
            message: message,
            stacktrace: stacktrace,
        },
    });
});

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
