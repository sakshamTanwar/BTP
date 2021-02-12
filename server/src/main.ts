import express, {Request, Response, NextFunction } from "express";
import {DbConnection} from './setup/db';
import session from "express-session"
import passport from "passport"
import passportInit from "./setup/passport" 
import indexRouter from "./routes/index"
import landrecordRouter from "./routes/landrecord"
import bodyParser from "body-parser"
import multer from "multer"

passportInit(passport);
// var multer = require('multer');
// var upload = multer();

const app = express();
const port = 8080; // default port to listen

//Establish DB Connection
DbConnection.connect();


//Middlewares

const upload = multer();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(upload.any());
app.use(session({secret: "SESSION_KEY"})); // Randomize it later
app.use(passport.initialize());
app.use(passport.session());

//Set Routes
app.use('/', indexRouter);
app.use('/landrecord', landrecordRouter);

//Error Handler Middleware
app.use((err:any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = err.statusCode || 500;
    let errorCode = err.error || 'server_err';
    let message = err.message || "Internal Server Error"
    res.status(statusCode).send({
        success: false,
        error:{
            code: errorCode,
            message: message
        }
    });
});

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
