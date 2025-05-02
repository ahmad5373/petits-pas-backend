import { Request, Response } from "express";
import { sendResponse } from "../utility/apiResponse";
import { AppVideos } from "../models/AppVideo";

export const createAppVideo = async (req: Request, res: Response):Promise<any> => {
    try {
        const { title, thumbnail, videoUrl, category } = req.body;
        
        const newAppVideo = new AppVideos({
            title,
            thumbnail,
            videoUrl,
            category
        });
        await newAppVideo.save();
        return sendResponse(res, 201, "App Video created successfully.", [], {AppVideos: newAppVideo});
    } catch (error: any) {
        return sendResponse(res, 500, `Error created AppVideos: ${error.message}`);
    }
};


export const getAllAppVideos = async (req: Request, res: Response): Promise<any> => {
    try {
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 5;
        const status = req.query.status as string || '';
        const title = req.query.title as string || '';
        const category = req.query.category as string || '';
        const query: { [key: string]: any } = {};
        if (status) query["status"] = status  
        if (category) query["category"] = category   // Case-insensitive search
        if (title) query["title"] = { $regex: title, $options: "i" }   // Case-insensitive search
        const totalResults = await AppVideos.countDocuments(query);
        const searchResults = await AppVideos.find(query).populate('category')
            .skip((page - 1) * limit)
            .limit(limit);

        const pagination = {
            currentPage: page,
            totalPages: Math.ceil(totalResults / limit),
            pageSize: limit,
            totalResults,
        };

        return sendResponse(res, 200, "App Videos fetched successfully", [], { pagination, results: searchResults });
    } catch (error: any) {
        console.error("Error fetching App Videos:", error);
        return sendResponse(res, 500, `Error fetching App Videos: ${error.message}`);
    }
};

export const getSingleAppVideo = async (req: Request, res: Response): Promise<any> => {
    try {
        const { videoId } = req.params;
        const appVideos = await AppVideos.findOne({ _id: videoId }).populate('category');
        if (!appVideos) {
            return sendResponse(res, 404, "App Videos not found");
        }
        return sendResponse(res, 200, "App Videos details fetch successfully.", [], appVideos);
    } catch (error: any) {
        return sendResponse(res, 500, `Error fetching App Videos: ${error.message}`);
    }
}

export const updateAppVideo = async (req: Request, res: Response): Promise<any> => {
    try {
        const { videoId } = req.params;
        const existingAppVideos = await AppVideos.findById(videoId);
        if (!existingAppVideos) {
            return sendResponse(res, 404, "App Video not found");
        }       
         const updatedAppVideos = await AppVideos.findByIdAndUpdate( videoId, req.body, { new: true, runValidators: true });
        return sendResponse(res, 200, "App Video updated successfully", [], updatedAppVideos);
    } catch (error: any) {
        return sendResponse(res, 500, `Error while updating App Video: ${error.message}`);
    }
}

export const deleteAppVideo = async (req: Request, res: Response): Promise<any> => {
    try {
        const { videoId } = req.params;
        const appVideos = await AppVideos.findOne({ _id: videoId });
        if (!appVideos) {
            return sendResponse(res, 404, "App Video not found");
        }
        await appVideos.deleteOne({ _id: videoId });
        return sendResponse(res, 200, "App Video deleted successfully");
    } catch (error: any) {
        return sendResponse(res, 500, `Error deleting App Video: ${error.message}`);
    }

}