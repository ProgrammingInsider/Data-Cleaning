import express from 'express';

const routes = express.Router();

// Public Controllers
import {
  Login,
  Register,
  RefreshToken,
  Logout
} from '../controllers/UserAuth.js';


// POST Routes
routes.route('/login').post(Login);
routes.route('/register').post(Register);
routes.route('/logout').get(Logout);
routes.route('/refreshtoken').get(RefreshToken);

export default routes;
