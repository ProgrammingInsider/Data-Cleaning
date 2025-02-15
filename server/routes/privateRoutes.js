import express from 'express';

const routes = express.Router();

// File Controllers
import { UploadFile, getUserFiles, deleteFile } from '../controllers/File.js';
import { ErrorDetection } from '../controllers/OpenAI.js';
import { CleanData, FetchActions, DeleteActions, DeleteAllActions } from '../controllers/CleanData.js';


// File routes
routes.route('/upload').post(UploadFile);
routes.route('/errordetection').post(ErrorDetection);
routes.route('/projects').get(getUserFiles);
routes.route('/delete/:id').delete(deleteFile);
routes.route('/cleandata').post(CleanData);
routes.route('/actions').get(FetchActions);
routes.route('/deleteaction').delete(DeleteActions);
routes.route('/deleteallaction').delete(DeleteAllActions);



export default routes;
