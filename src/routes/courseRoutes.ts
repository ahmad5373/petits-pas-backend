import express, { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { checkUploadStatus, createCourse, deleteCourse, deleteVideo, FetchVideoDetails, getAllCourses, getSingleCourse, updateCourse, updateVideo, uploadVimeoVideo } from "../controller/courseController";
import { upload } from "../middleware/videoUploader";


const courseRoutes:Router = express.Router();

courseRoutes.post("/upload", upload.single('video'), uploadVimeoVideo);
// Route for checking upload status
courseRoutes.get("/upload/status/:jobId", checkUploadStatus);
courseRoutes.get("/video/:videoId", FetchVideoDetails);
courseRoutes.patch("/video/:videoId", updateVideo);
courseRoutes.delete("/video/:videoId", deleteVideo);
courseRoutes.post("/add-course",  authenticateUser,  createCourse); 
courseRoutes.get('/' , getAllCourses);
courseRoutes.get('/:CourseId' , getSingleCourse);
courseRoutes.put('/:CourseId' , authenticateUser, updateCourse);
courseRoutes.delete('/:CourseId' , deleteCourse);

export default courseRoutes;
