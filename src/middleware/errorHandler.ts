import { NextFunction, Request, request, Response, response } from "express";
import { sendResponse } from "../utility/apiResponse";

export const errorHandler = async (err:any, req:Request , res: Response, next: NextFunction): Promise<any> =>{
    console.log("in error handler....");
    const errStatus = err?.code || 500;
    const errMsg = err?.message || 'Simething went wrong';
    return sendResponse(res, errStatus, errMsg);
}