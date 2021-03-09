import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import formRouter from './routes/forms';
import indexRouter from './routes/index';

const app = express();
const port = process.env.port || 8080;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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
app.use('/', indexRouter);
app.use('/form', formRouter);
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

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
