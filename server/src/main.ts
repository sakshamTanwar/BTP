import express from "express";
import {DbConnection} from './db'

const app = express();
const port = 8080; // default port to listen

//Establish DB Connection
DbConnection.connect();

//Define Routes
var indexRouter = require('./routes/index');
var landrecordRouter = require('./routes/landrecord');

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Set Routes
app.use('/', indexRouter);
app.use('/landrecord', landrecordRouter);

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
