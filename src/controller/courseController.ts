import { Request, Response } from "express";
import { Course } from "../models/Course";
import { sendResponse } from "../utility/apiResponse";

export const createCourse = async (req: Request, res: Response):Promise<any> => {
    try {
        const { title, image, introduction, content, category } = req.body;
        
        const newCourse = new Course({
            title,
            image,
            introduction,
            content, // This contains the uploaded Vimeo video URLs
            category
        });
        await newCourse.save();
        return sendResponse(res, 201, "Course created successfully.", [], {course: newCourse});
    } catch (error: any) {
        return sendResponse(res, 500, `Error created course: ${error.message}`);
    }
};


export const getAllCourses = async (req: Request, res: Response): Promise<any> => {
    try {
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 5;
        const status = req.query.status as string || '';
        const name = req.query.name as string || '';

        const query: { [key: string]: any } = {};
        if (status) query["status"] = { $regex: status, $options: "i" }   // Case-insensitive search
        if (name) query["title"] = { $regex: name, $options: "i" }   // Case-insensitive search

        const totalResults = await Course.countDocuments(query);
        const searchResults = await Course.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        const pagination = {
            currentPage: page,
            totalPages: Math.ceil(totalResults / limit),
            pageSize: limit,
            totalResults,
        };

        return sendResponse(res, 200, "Courses fetched successfully", [], { pagination, results: searchResults });
    } catch (error: any) {
        console.error("Error fetching Courses:", error);
        return sendResponse(res, 500, `Error fetching Courses: ${error.message}`);
    }
};

export const getSingleCourse = async (req: Request, res: Response): Promise<any> => {
    try {
        const { CourseId } = req.params;
        const course = await Course.findOne({ _id: CourseId });
        if (!course) {
            return sendResponse(res, 404, "Course not found");
        }
        return sendResponse(res, 200, "Course details fetch successfully.", [], course);
    } catch (error: any) {
        return sendResponse(res, 500, `Error fetching Courses: ${error.message}`);
    }
}

export const updateCourse = async (req: Request, res: Response): Promise<any> => {
    try {
        const { CourseId } = req.params;
        const existingCourse = await Course.findById(CourseId);
        if (!existingCourse) {
            return sendResponse(res, 404, "Course not found");
        }       
         const updatedCourse = await Course.findByIdAndUpdate( CourseId, req.body, { new: true, runValidators: true });
        return sendResponse(res, 200, "Course updated successfully", [], updatedCourse);
    } catch (error: any) {
        return sendResponse(res, 500, `Error while updating Course: ${error.message}`);
    }
}

export const deleteCourse = async (req: Request, res: Response): Promise<any> => {
    try {
        const { CourseId } = req.params;
        const course = await Course.findOne({ _id: CourseId });
        if (!course) {
            return sendResponse(res, 404, "Course not found");
        }
        await course.deleteOne({ _id: CourseId });
        return sendResponse(res, 200, "Course deleted successfully");
    } catch (error: any) {
        return sendResponse(res, 500, `Error deleting Course: ${error.message}`);
    }

}