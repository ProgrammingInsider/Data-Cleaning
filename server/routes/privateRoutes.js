import express from 'express';

const routes = express.Router();

// File Controllers
import { UploadFile, getUserFiles, deleteFile, getSchema, editSchema, getIssue } from '../controllers/File.js';
import { CleanData, FetchActions, DeleteActions, DeleteAllActions } from '../controllers/CleanData.js';


// File routes
routes.route('/upload').post(UploadFile);
routes.route('/projects').get(getUserFiles);
routes.route('/delete/:id').delete(deleteFile);
routes.route('/cleandata').post(CleanData);
routes.route('/actions').get(FetchActions);
routes.route('/deleteaction').delete(DeleteActions);
routes.route('/deleteallaction').delete(DeleteAllActions);

// Schema
routes.route('/getschema').get(getSchema);
routes.route('/editschema').put(editSchema);

// Issues
routes.route('/getissue').get(getIssue);

export default routes;
