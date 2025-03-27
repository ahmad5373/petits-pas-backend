import express, { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { addReview, getAverageRating, getVendorReviews, } from "../controller/reviewController";
import { addReviewValidation, requestValidation } from "../validation";

const reviewRoutes:Router = express.Router();

reviewRoutes.post("/add-review",addReviewValidation, requestValidation, authenticateUser, addReview); 
reviewRoutes.get("/:reviewFor/stats", getAverageRating);
reviewRoutes.get("/:reviewFor", getVendorReviews); 

export default reviewRoutes;
