import { Request, Response } from "express";
import { Course } from "../models/Course";
import { sendResponse } from "../utility/apiResponse";


import fs from 'fs';
import { Vimeo } from 'vimeo';
import { CourseProgress } from "../models/CourseProgress";
console.log('process.env.VIMEO_TOKEN :>> ', process.env.VIMEO_TOKEN);
console.log('process.env.VIMEO_CLIENT_IDENTIFIER :>> ', process.env.VIMEO_CLIENT_IDENTIFIER);
console.log('process.env.VIMEO_CLIENT_SECRETS :>> ', process.env.VIMEO_CLIENT_SECRETS);

interface UploadStatus {
  jobId: string;
  status: 'processing' | 'complete' | 'failed';
  progress: number;
  vimeoUri: string | null;
  error: string | null;
}

// Create a map to store upload statuses
const uploadStatuses = new Map<string, UploadStatus>();

const client = new Vimeo(
  process.env.VIMEO_CLIENT_IDENTIFIER || '',
  process.env.VIMEO_CLIENT_SECRETS || '',
  process.env.VIMEO_TOKEN || ''
);

export const uploadVimeoVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      sendResponse(res, 400, 'No video file provided');
      return;
    }
    const { title } = req.body;
    const filePath = req.file.path;
    const jobId = Date.now().toString();

    const uploadStatus: UploadStatus = {
      jobId,
      status: 'processing',
      progress: 0,
      vimeoUri: null,
      error: null
    };
    uploadStatuses.set(jobId, uploadStatus);
    // Immediately return the job ID so frontend can track status
    sendResponse(res, 202, 'Upload started', [], { jobId });
    client.upload(
      filePath,
      {
        name: title || 'Untitled Video',
        privacy: {
          view: 'anybody',
          comments: 'anybody'
        }
      },
      function (uri: string) {
        const status = uploadStatuses.get(jobId);
        if (status) {
          status.status = 'complete';
          status.vimeoUri = uri;
          uploadStatuses.set(jobId, status);
        }
        fs.unlink(filePath, (err) => {
          if (err) console.error('Error deleting temp file:', err);
        });
      },
      function (bytes_uploaded: number, bytes_total: number) {
        const percentage = (bytes_uploaded / bytes_total * 100).toFixed(2);
        const status = uploadStatuses.get(jobId);
        if (status) {
          status.progress = parseFloat(percentage);
          uploadStatuses.set(jobId, status);
        }
        console.log(`${percentage}% uploaded`);
      },
      function (error: any) {
        const status = uploadStatuses.get(jobId);
        if (status) {
          status.status = 'failed';
          status.error = error.message;
          uploadStatuses.set(jobId, status);
        }
        fs.unlink(filePath, (err) => {
          if (err) console.error('Error deleting temp file:', err);
        });
        console.error('Failed to upload', error);
      }
    );
  } catch (error: any) {
    sendResponse(res, 500, `Error uploading video: ${error.message}`);
  }
};

export const checkUploadStatus = (req: Request, res: Response): void => {
  const { jobId } = req.params;
  if (!jobId) {
    sendResponse(res, 400, 'Job ID is required');
    return;
  }
  const status = uploadStatuses.get(jobId);
  if (status) {
    res.json(status);
  } else {
    sendResponse(res, 404, 'Job not found');
  }
};

export const FetchVideoDetails = async (req: Request, res: Response): Promise<any> => {
  try {
    const { videoId } = req.params;

    client.request({
      method: 'GET',
      path: `/videos/${videoId}`
    }, (error, body, statusCode, headers) => {
      if (error) {
        return sendResponse(res, 400, `There is error while getting video: ${error.message}`);
      }

      return sendResponse(res, 200, 'Video details fetched successfully', body);
    });
  } catch (error: any) {
    return sendResponse(res, 500, `Error fetching video: ${error.message}`);
  }
};

export const updateVideo = async (req: Request, res: Response): Promise<any> => {
  try {
    const { videoId } = req.params;
    client.request({
      method: 'PATCH',
      path: `/videos/${videoId}`,
      query: req.body // Can include name, description, privacy settings, etc.
    }, (error, body, statusCode, headers) => {
      if (error) {
        return sendResponse(res, 400, `Error updating video: ${error.message}`);
      }
      return sendResponse(res, 200, 'Video updated successfully', body);
    });
  } catch (error: any) {
    return sendResponse(res, 500, `Error updating video: ${error.message}`);
  }
};

export const deleteVideo = async (req: Request, res: Response): Promise<any> => {
  try {
    const { videoId } = req.params;

    client.request({
      method: 'DELETE',
      path: `/videos/${videoId}`
    }, (error: any) => {
      if (error) {
        return sendResponse(res, 400, `Error deleting video: ${error.message}`);
      }
      return sendResponse(res, 200, 'Video deleted successfully');
    });
  } catch (error: any) {
    return sendResponse(res, 500, `Error deleting video: ${error.message}`);
  }
};

export const createCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, image, introduction, content, category } = req.body;

    const newCourse = new Course({
      title,
      image,
      introduction,
      content,
      category
    });
    await newCourse.save();
    return sendResponse(res, 201, "Course created successfully.", [], { course: newCourse });
  } catch (error: any) {
    return sendResponse(res, 500, `Error created course: ${error.message}`);
  }
};

export const startCourseForUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, courseId } = req.body;
const course = await Course.findById(courseId);
const videoProgress = course?.content.map(video => ({
  videoId: video?.videoUrl,
  completed: false
}));

await CourseProgress.create({
  userId,
  courseId,
  videoProgress
});
    return sendResponse(res, 201, "Course started.",);
  } catch (error: any) {
    return sendResponse(res, 500, `Error starting course: ${error.message}`);
  }
};


export const getAllCourses = async (req: Request, res: Response): Promise<any> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 50;
    const isCompleteQuery = req.query.isComplete;
    const isComplete = typeof isCompleteQuery === 'string' ? isCompleteQuery === 'true' : undefined;
    const status = req.query.status as string || '';
    const title = req.query.title as string || '';
    const query: { [key: string]: any } = {};
    if (status) query["status"] = status
    if (title) query["title"] = { $regex: title, $options: "i" }   // Case-insensitive search
    if (typeof isComplete === 'boolean') query["isComplete"] = isComplete;
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
    const updatedCourse = await Course.findByIdAndUpdate(CourseId, req.body, { new: true, runValidators: true });
    return sendResponse(res, 200, "Course updated successfully", [], updatedCourse);
  } catch (error: any) {
    return sendResponse(res, 500, `Error while updating Course: ${error.message}`);
  }
}

export const deleteCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const { CourseId } = req.params;
    const course = await Course.findById(CourseId);
    if (!course) {
      return sendResponse(res, 404, "Course not found");
    }
    if (course?.content && course?.content.length > 0) {
      const deleteVideoFromVimeo = (videoUrl: string) => {
        return new Promise((resolve, reject) => {
          client.request({
            method: 'DELETE',
            path: `/videos/${videoUrl}`
          }, (error: any) => {
            if (error) {
              console.error(`Error deleting video ${videoUrl} from Vimeo:`, error);
              resolve(false);
            } else {
              resolve(true);
            }
          });
        });
      };
      const deletionPromises = course?.content?.map(video => {
        if (video.videoUrl) {
          return deleteVideoFromVimeo(video.videoUrl);
        }
        return Promise.resolve(true);
      });
      await Promise.all(deletionPromises);
    }
    await Course.deleteOne({ _id: CourseId });
    return sendResponse(res, 200, "Course and associated videos deleted successfully");
  } catch (error: any) {
    console.error("Error deleting course:", error);
    return sendResponse(res, 500, `Error deleting Course: ${error.message || 'Unknown error'}`);
  }
}
