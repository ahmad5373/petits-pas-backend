import { Request, Response } from "express";
import { Faqs } from "../models/Faqs";
import { sendResponse } from "../utility/apiResponse";

export const createFaqs = async (req:Request, res:Response): Promise<any> => {
    const { question, answer } = req.body;
    try {
        await Faqs.create({ question, answer });
        return sendResponse(res, 201, "Question Created Successfully!");
    } catch (error:any) {
        return sendResponse(res, 500, `Error creating user: ${error.message}`);
    }
};


export const getAllFaqs =async (req:Request, res:Response): Promise<any> => {
    try {
        const faqs = await Faqs.find()        
        return sendResponse(res, 200, "All Faqs fetched successfully", [], faqs);
    } catch (error:any) {
        return sendResponse(res, 500, `Error fetching messages: ${error.message}`);
    }
};

export const getFaqsWithId =async (req:Request, res:Response): Promise<any> => {
    const { id } = req.params;
    try {
        const faqs = await Faqs.findById(id)
        if (!faqs) {
            return sendResponse(res, 404, "faqs not found");
        }
        return sendResponse(res, 200, "Faqs details fetched successfully", [], faqs);
    } catch (error:any) {
        return sendResponse(res, 500, `Error fetching Faqs: ${error.message}`);
    }
};

export const editFaqs =async (req:Request, res:Response): Promise<any> => {
    const { id } = req.params;
    const { question, answer } = req.body;
    try {
        const updateFaqs = await Faqs.findByIdAndUpdate(id, { question , answer}, { new: true, runValidators: true });
        if (!updateFaqs) {
            return sendResponse(res, 404, "Faqs not found");
        }
        return sendResponse(res, 200, "Faqs updated successfully", [], updateFaqs);
    } catch (error:any) {
        return sendResponse(res, 500, `Error updating Faqs: ${error.message}`);
    }
};

export const deleteFaqs =async (req:Request, res:Response): Promise<any> => {
    const { id } = req.params;
    try {
        const faqs = await Faqs.findById(id);
        if (!faqs) {
            return sendResponse(res, 404, "Faqs not found");
        }
        await Faqs.deleteOne({ _id: id });
        return sendResponse(res, 200, "Faqs deleted successfully");
    } catch (error:any) {
        return sendResponse(res, 500, `Error deleting Faqs: ${error.message}`);
    }
};
