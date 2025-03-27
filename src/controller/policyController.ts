import { Request, Response } from "express";
import { Policy } from "../models/Policy";
import { sendResponse } from "../utility/apiResponse";

export const getPolicy = async (req:Request, res:Response): Promise<any> => {
    const { type } = req.params;

    try {
        const policies = await Policy.findOne({ type });
        if (policies) {
            return sendResponse(res, 200, "fetch Successfully", [], policies.content);
        }
        return sendResponse(res, 404, `${type} Policy not found.`);

    } catch (error: any) {
        return sendResponse(res, 500, `Error fetching ${type} Policy.`, error.message);
    }
};

export const addPolicy = async (req:Request, res:Response): Promise<any>=> {
    const { type } = req.params;
    const { content } = req.body;

    if (!content) {
        return sendResponse(res, 500, "Content is required")
    }

    try {
        let policies = await Policy.findOne({ type });
        if (policies) {
            policies.content = content;
            policies.updatedAt = new Date();
            await policies.save();
            return sendResponse(res, 200, `${type} Policy updated successfully.`);
        } else {
            policies = new Policy({ type, content });
            await policies.save();
            return sendResponse(res, 200, `${type} Policy created successfully.`);
        }
    } catch (error: any) {
        return sendResponse(res, 500, `Error saving ${type} Policy.`, error.message);

    }
};
