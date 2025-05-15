import * as express from 'express'
import { Router } from 'express';
import { deleteUser, getAdmin, getAllUsers,  getLoggedInUser,  getSingleUser, updateUser } from '../controller/userController';
import { authenticateUser } from '../middleware/authMiddleware';

const userRoutes:Router = express.Router();

userRoutes.get('/' , getAllUsers);
userRoutes.get('/loggedInUser' , authenticateUser, getLoggedInUser);
userRoutes.get('/:get-admin', authenticateUser, getAdmin);
userRoutes.get('/:userId' , getSingleUser);
userRoutes.put('/:userId' , authenticateUser, updateUser);
userRoutes.delete('/:userId' , deleteUser);


export default userRoutes ;
