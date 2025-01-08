// External Packages
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import xss from 'xss-clean';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import 'express-async-errors';
import rateLimit from 'express-rate-limit';
import fileUpload from 'express-fileupload';
import path from 'path';

// Get the directory name of the current module
const __dirname = process.cwd();

// Invoke External Packages
const app = express();
dotenv.config();

// Routes
import publicRoutes from './routes/publicRoutes.js';


// Middleware
import credentials from './middleware/credentials.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import { privateAuth } from './middleware/privateAuth.js';

// Config
import corsOptions from './config/corsOptions.js';
import { Db_connection } from './DB/db.js';

// Security Middleware
app.use(helmet());
app.use(xss());

// General Middleware
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    createParentPath: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(credentials);
app.use(cors(corsOptions));
Db_connection();

app.use('/api/v1/data-cleaning/', publicRoutes);
app.use('/api/v1/data-cleaning/', privateAuth,publicRoutes);


app.use(notFound);
app.use(errorHandler);

export default app;
