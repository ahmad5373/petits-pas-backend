import { Request, Response } from "express";
import { Course } from "../models/Course";
import { CourseProgress } from "../models/CourseProgress";
import { sendResponse } from "../utility/apiResponse";
import { Types } from "mongoose";


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

        const progress = await CourseProgress.findOne({ userId, courseId }); if (!progress) return sendResponse(res, 404, "Progress not found");

        const video = progress.videoProgress.find(v => v.videoId === videoId); if (!video) return sendResponse(res, 400, "Invalid video ID");

        video.completed = true;        // Calculate new progress
        const completedCount = progress.videoProgress.filter(v => v.completed).length;
        const total = progress.videoProgress.length;        const newProgress =         Math.floor((completedCount / total) * 100);

        progress.progress = newProgress;       progress.isComplete =      newProgress === 100;

        await progress.save();
        return sendResponse(res, 200, "Progress updated", [], progress);
    } catch (error: any) {
        return sendResponse(res, 500, `Update failed: ${error.message}`);
    }
};



export const getUserCourseProgress = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { userId, courseId } = req.query;
        if (courseId) {
            // === Single course progress ===
            const course = await Course.findById(courseId).lean();
            if (!course) return sendResponse(res, 404, "Course not found");

            const progress = await CourseProgress.findOne({ userId, courseId });
            if (!progress) {
                return sendResponse(res, 404, "Course not assigned or started by this user");
            }

            const videoProgressMap: Record<string, boolean> = {};
            progress.videoProgress.forEach(v => {
                videoProgressMap[v.videoId] = v.completed;
            });

            const contentWithProgress = course.content.map(video => ({
                ...video,
                completed: videoProgressMap[video.videoUrl] || false
            }));

            return sendResponse(res, 200, "Single course with progress", [], {
                ...course,
                content: contentWithProgress,
                progress: progress.progress || 0,
                isComplete: progress.isComplete || false
            });
        }

        // === User's all courses with progress ===
        const progressDocs = await CourseProgress.find({ userId });
       
        
        const courseIds = progressDocs.map(p => p.courseId);
        const courses = await Course.find({ _id: { $in: courseIds } }).lean();
        
        const progressMap: Record<string, any> = {};
        progressDocs.forEach(p => {
            progressMap[p.courseId.toString()] = p;
        });
        

        // const progressDocs = await CourseProgress.find({ userId });
        // if (progressDocs.length === 0) {
        //     return sendResponse(res, 404, "No courses assigned to this user");
        // }
        const mergedCourses = courses.map(course => {
            const courseId = course._id.toString();
            const progress = progressMap[courseId];
            const progressVideoMap: Record<string, boolean> = {};

            if (progress) {
                progress.videoProgress.forEach((v: any) => {
                    progressVideoMap[v.videoId] = v.completed;
                });
            }

            const contentWithProgress = course.content.map(video => ({
                ...video,
                completed: progressVideoMap[video.videoUrl] || false
            }));

            return {
                ...course,
                content: contentWithProgress,
                progress: progress?.progress || 0,
                isComplete: progress?.isComplete || false
            };
        });

        return sendResponse(res, 200, "All assigned courses with progress", [], mergedCourses);
    } catch (error: any) {
        return sendResponse(res, 500, `Error fetching course progress: ${error.message}`);
    }
};