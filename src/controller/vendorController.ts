import { Request, Response } from "express";
import { sendResponse } from "../utility/apiResponse";
import Category from "../models/Categories";

interface AuthRequest extends Request {
    user?: { user_id: string; role: string };
}

export const addCategory = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { name } = req.body;
        const category = await Category.findOne({ name });
        if (category) {
            return sendResponse(res, 404, "Category with same name already exist");
        }
        await Category.create({ name: name });
        return sendResponse(res, 201, "category added successfully");
    } catch (error: any) {
        console.error("Error adding category:", error);
        return sendResponse(res, 500, `Error adding category: ${error.message}`);
    }
};


export const getAllCategories = async (req: Request, res: Response): Promise<any> => {
    try {
        const category = await Category.find();
        return sendResponse(res, 200, "Category fetched successfully", [], { categories: category });
    } catch (error: any) {
        console.error("Error fetching Category:", error);
        return sendResponse(res, 500, `Error fetching Category: ${error.message}`);
    }
};

// export const getAllProductByCategory = async (req: Request, res: Response): Promise<any> => {
//     try {
//         const categoryProduct = await Product.find({ category: req.params.categoryId });
//         return sendResponse(res, 200, "Category with product fetched successfully", [], { categories: categoryProduct });
//     } catch (error: any) {
//         console.error("Error fetching Category with products:", error);
//         return sendResponse(res, 500, `Error fetching Category with product: ${error.message}`);
//     }
// };


export const getSingleCategory = async (req: Request, res: Response): Promise<any> => {
    try {
        const { categoryId } = req.params;
        const category = await Category.findOne({ _id: categoryId });
        if (!category) {
            return sendResponse(res, 404, "Category not found");
        }
        return sendResponse(res, 200, "Category details fetch successfully.", [], category);
    } catch (error: any) {
        return sendResponse(res, 500, `Error fetching Category: ${error.message}`);
    }
}

export const deleteCategory = async (req: Request, res: Response): Promise<any> => {
    try {
        const { categoryId } = req.params;
        const category = await Category.findOne({ _id: categoryId });
        if (!category) {
            return sendResponse(res, 404, "Category not found");
        }
        await Category.deleteOne({ _id: categoryId });
        return sendResponse(res, 200, "Category deleted successfully");
    } catch (error: any) {
        return sendResponse(res, 500, `Error deleting Category: ${error.message}`);
    }
}