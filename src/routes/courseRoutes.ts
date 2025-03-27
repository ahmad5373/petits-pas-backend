import express, { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { createCourse, deleteCourse, getAllCourses, getSingleCourse, updateCourse } from "../controller/courseController";


const courseRoutes:Router = express.Router();

courseRoutes.post("/add-course",  authenticateUser,  createCourse); 
courseRoutes.get('/' , getAllCourses);
courseRoutes.get('/:CourseId' , getSingleCourse);
courseRoutes.put('/:CourseId' , authenticateUser, updateCourse);
courseRoutes.delete('/:CourseId' , deleteCourse);

export default courseRoutes;
