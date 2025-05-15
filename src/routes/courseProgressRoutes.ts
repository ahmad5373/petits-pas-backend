import * as express from 'express'
import { Router } from 'express';
import { authenticateUser } from '../middleware/authMiddleware';
import { getUserCourseProgress, initializeCourseProgress, markVideoAsComplete } from '../controller/courseProgressController';

const couresProgressRoutes:Router = express.Router();

couresProgressRoutes.post('/initialize' , authenticateUser, initializeCourseProgress);
couresProgressRoutes.post('/complete', authenticateUser, markVideoAsComplete);
couresProgressRoutes.get('/status' , getUserCourseProgress);


export default couresProgressRoutes ;
