import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = process.env.port || 8080;

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
