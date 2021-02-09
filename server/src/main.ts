import express from "express";
import {DbConnection} from './setup/db';
import session from "express-session"
import passport from "passport"
import passportInit from "./setup/passport" 
import indexRouter from "./routes/index"
import landrecordRouter from "./routes/landrecord"

passportInit(passport);


const app = express();
const port = 8080; // default port to listen

//Establish DB Connection
DbConnection.connect();

//Define Routes


//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({secret: "SESSION_KEY"})); // Randomize it later
app.use(passport.initialize());
app.use(passport.session());

//Set Routes
app.use('/', indexRouter);
app.use('/landrecord', landrecordRouter);

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
