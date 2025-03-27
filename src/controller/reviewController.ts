import { Request, Response } from "express";
import { Review } from "../models/Review";
import { sendResponse } from "../utility/apiResponse";
import mongoose from "mongoose";

interface AuthRequest extends Request {
    user?: { user_id: string; role: string };
}

export const addReview = async(req: AuthRequest, res:Response): Promise<any> => {
    try {
        // const {vendorId} = req.params;
        const {reviewFor, rating, comment} = req.body;
        const review = await Review.create({user:req.user?.user_id, reviewFor, rating, comment});
        return sendResponse(res, 201, "Review added Successfully.", [], review);
    } catch (error:any) {
        return sendResponse(res, 201, `Error adding review: ${error.message}`)
    }
}

export const getVendorReviews = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { reviewFor } = req.params;

        // Find all reviews linked to this vendor
        const reviews = await Review.find({ reviewFor })
            .populate("user", "name email profileImage");

        if (reviews.length === 0) {
            return sendResponse(res, 404, "No reviews found.");
        }

        return sendResponse(res, 200, "Reviews fetched successfully.", [], reviews);
    } catch (error: any) {
        return sendResponse(res, 500, `Error fetching reviews: ${error.message}`);
    }
};

export const getAverageRating = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { reviewFor } = req.params;

        const reviews = await Review.aggregate([
            { $match: { reviewFor: new mongoose.Types.ObjectId(reviewFor) } },
            {
                $group: {
                    _id: "$reviewFor",
                    averageRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 },
                },
            },
        ]);

        if (!reviews.length) return sendResponse(res, 404, "No reviews found");

        return sendResponse(res, 200, "Average rating fetched successfully", [], reviews[0]);
    } catch (error: any) {
        return sendResponse(res, 500, `Error fetching average rating: ${error.message}`);
    }
};
