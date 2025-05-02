import express, { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { createAppVideo, deleteAppVideo, getAllAppVideos, getSingleAppVideo, updateAppVideo } from "../controller/appVideosController";
import { AddAppVideoValidation, requestValidation } from "../validation";


const courseRoutes:Router = express.Router();

// courseRoutes.post("/upload", upload.single('video'), uploadVimeoVideo);
// // Route for checking upload status
// courseRoutes.get("/upload/status/:jobId", checkUploadStatus);
// courseRoutes.get("/video/:videoId", FetchVideoDetails);
// courseRoutes.patch("/video/:videoId", updateVideo);
// courseRoutes.delete("/video/:videoId", deleteVideo);
courseRoutes.post("/add-app-video", AddAppVideoValidation, requestValidation, authenticateUser,  createAppVideo); 
courseRoutes.get('/' , getAllAppVideos);
courseRoutes.get('/:videoId' , getSingleAppVideo);
courseRoutes.put('/:videoId' , authenticateUser, updateAppVideo);
courseRoutes.delete('/:videoId' , deleteAppVideo);

export default courseRoutes;
