import express from 'express';

const routes = express.Router();

// Auth Controllers
import {
  Login,
  Register,
} from '../controllers/UserAuth.js';


// Auth Routes
routes.route('/login').post(Login);
routes.route('/register').post(Register);


export default routes;
