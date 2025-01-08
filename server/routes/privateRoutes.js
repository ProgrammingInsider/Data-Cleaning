import express from 'express';

const routes = express.Router();

// File Controllers
import { UploadFile } from '../controllers/File.js';


// File routes
routes.route('/upload').post(UploadFile);


export default routes;
