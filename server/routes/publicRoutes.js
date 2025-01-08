import express from 'express';

const routes = express.Router();

// Public Controllers
import {
  Login,
  Register,
} from '../controllers/UserAuth.js';


// POST Routes
routes.route('/login').post(Login);
routes.route('/register').post(Register);

export default routes;
