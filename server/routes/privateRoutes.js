import express from 'express';

const routes = express.Router();

// File Controllers
import { UploadFile, getUserFiles, deleteFile } from '../controllers/File.js';
import { ErrorDetection } from '../controllers/OpenAI.js';



// File routes
routes.route('/upload').post(UploadFile);
routes.route('/errordetection').post(ErrorDetection);
routes.route('/projects').get(getUserFiles);
routes.route('/delete/:id').delete(deleteFile);



export default routes;
