import { Response } from "express";

export const sendResponse = (
    responseObj: Response, 
    statusCode: number, 
    message: string, 
    errors: any[] = [], 
    data: any = null
) => {
    console.log("sendResponse is calling");

    const response = {
        status: [200, 201, 202, 203, 304].includes(statusCode), 
        message: message ?? '',
        errors: errors.length === 0 ? {} : errors, 
        data: data,
    };

    return responseObj.status(statusCode).json(response);
};
