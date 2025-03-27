import * as express from 'express'
import { Router } from 'express';
import { deleteUser, getAllUsers,  getSingleUser, updateUser } from '../controller/userController';
import { authenticateUser } from '../middleware/authMiddleware';

const userRoutes:Router = express.Router();

userRoutes.get('/' , getAllUsers);
userRoutes.get('/:userId' , getSingleUser);
userRoutes.put('/:userId' , authenticateUser, updateUser);
userRoutes.delete('/:userId' , deleteUser);

export default userRoutes ;
