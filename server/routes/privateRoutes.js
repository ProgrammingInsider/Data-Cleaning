import express from 'express';

const routes = express.Router();

// File Controllers
import { UploadFile, getUserFiles } from '../controllers/File.js';


// File routes
routes.route('/upload').post(UploadFile);
routes.route('/projects').get(getUserFiles);


export default routes;
