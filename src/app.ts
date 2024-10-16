import express, { Application, Request, Response, NextFunction } from 'express';
import bodyparser from 'body-parser';
import session from 'express-session';
import path = require("path");
import {v4 as uuidv4} from 'uuid';
import mongoose from 'mongoose';
import router from './routes/routes';
import nocache from './Middlewares/customnocache';

const app: Application = express();

const port: number = Number(process.env.PORT) || 3001;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));

app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: false
}))

app.use(nocache);

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/', router);

//Connection to mongoDB
mongoose.connect("mongodb://localhost:27017/userDatabase")
.then((): void => {
    console.log("Successfully connected to MongoDB");
}).catch((err: Error): void => {
    console.error("Error connecting to MongoDB");
});

//Starting server
app.listen(port, (err?: Error): void => {
    if(err) {
        console.log("Error loading server");
    }
    else {
        console.log("Server started listening on: http://localhost:3001")
    }
});