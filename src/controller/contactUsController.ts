import { Request, Response } from "express";
import { sendResponse } from "../utility/apiResponse";
import { ContactUs } from "../models/ContactUs";

export const addContactUs = async (req:Request, res:Response): Promise<any> => {
    const {name, email, message } = req.body;
    try {
        await ContactUs.create({ name, email, message });
        return sendResponse(res, 201, "Thank you for reaching out to us we will get back to you promptly.!");
    } catch (error:any) {
        return sendResponse(res, 500, `Error creating message: ${error.message}`);
    }
};


export const getAllContactUs =async (req:Request, res:Response): Promise<any> => {
    try {
        const contactUs = await ContactUs.find()        
        return sendResponse(res, 200, "All ContactUs fetched successfully", [], contactUs);
    } catch (error:any) {
        return sendResponse(res, 500, `Error fetching messages: ${error.message}`);
    }
};

export const getContactUsWithId =async (req:Request, res:Response): Promise<any> => {
    const { id } = req.params;
    try {
        const contactUs = await ContactUs.findById(id)
        if (!contactUs) {
            return sendResponse(res, 404, "ContactUs not found");
        }
        return sendResponse(res, 200, "ContactUs details fetched successfully", [], contactUs);
    } catch (error:any) {
        return sendResponse(res, 500, `Error fetching ContactUs: ${error.message}`);
    }
};

export const deleteContactUs =async (req:Request, res:Response): Promise<any> => {
    const { id } = req.params;
    try {
        const contactUs = await ContactUs.findById(id);
        if (!contactUs) {
            return sendResponse(res, 404, "ContactUs not found");
        }
        await contactUs.deleteOne({ _id: id });
        return sendResponse(res, 200, "ContactUs deleted successfully");
    } catch (error:any) {
        return sendResponse(res, 500, `Error deleting ContactUs: ${error.message}`);
    }
};
