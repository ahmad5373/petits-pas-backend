import { Request, Response } from "express";
import { Course } from "../models/Course";
import { CourseProgress } from "../models/CourseProgress";
import { sendResponse } from "../utility/apiResponse";


interface AuthRequest extends Request {
    user?: { user_id: string; role: string };
}


export const initializeCourseProgress = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const userId = req?.user?.user_id; // ensure req.user is set via auth middleware
        const { courseId } = req.body;

        const course = await Course.findById(courseId);
        if (!course) return sendResponse(res, 404, "Course not found");

        const existing = await CourseProgress.findOne({ userId, courseId });
        if (existing) return sendResponse(res, 200, "Course already started", [], existing);

        const videoProgress = course.content.map((video) => (
            {
                videoId: video?.videoUrl,
                completed: false,
            }));

        const progress = new CourseProgress({
            userId,
            courseId,
            videoProgress,
            isComplete: false,
            progress: 0,
        });
        console.log('progress :>> ', progress);
        await progress.save();
        return sendResponse(res, 201, "Progress initialized", [], progress);
    } catch (error: any) {
        return sendResponse(res, 500, `Initialization failed: ${error.message}`);
    }
};

export const markVideoAsComplete = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const userId = req?.user?.user_id;
        const { courseId, videoId } = req.body;

        const progress = await CourseProgress.findOne({ userId, courseId });
        if (!progress) return sendResponse(res, 404, "Progress not found");

        const video = progress.videoProgress.find(v => v.videoId === videoId);
        if (!video) return sendResponse(res, 400, "Invalid video ID");

        video.completed = true;

        // Calculate new progress
        const completedCount = progress.videoProgress.filter(v => v.completed).length;
        const total = progress.videoProgress.length;
        const newProgress = Math.floor((completedCount / total) * 100);

        progress.progress = newProgress;
        progress.isComplete = newProgress === 100;

        await progress.save();
        return sendResponse(res, 200, "Progress updated", [], progress);
    } catch (error: any) {
        return sendResponse(res, 500, `Update failed: ${error.message}`);
    }
};

export const getUserCourseProgress = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { courseId, userId} = req.query;

        const progress = await CourseProgress.findOne({ userId, courseId });
        console.log('progress :>> ', progress);
        if (!progress) return sendResponse(res, 404, "Progress not found");

        return sendResponse(res, 200, "Progress retrieved", [], progress);
    } catch (error: any) {
        return sendResponse(res, 500, `Error fetching progress: ${error.message}`);
    }
};
