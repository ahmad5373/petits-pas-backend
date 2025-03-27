import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utility/apiResponse";
import { body, validationResult } from "express-validator";

export const requestValidation = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const extractedResults = errors.array().map(err => ({
            field: (err as any).path,
            message: err.msg,
        }));

        return sendResponse(res, 422, "Invalid request data", extractedResults);

    }

    return next();
};

export const registerUserValidation = [
    body("email")
        .notEmpty().withMessage("Email is required").bail()
        .isEmail().withMessage("Please provide a valid email")
        .toLowerCase().trim(),
    body("password")
        .notEmpty().withMessage("Password is required").bail()
        .isString().withMessage("Password must be of type string").bail()
        .isLength({ min: 6, max: 20 }).withMessage("Password must be between 6 to 20 characters"),
];

export const loginValidation = [
    body("email")
        .notEmpty().withMessage("Email is required").bail()
        .isEmail().withMessage("Please provide a valid email")
        .toLowerCase().trim(),

    body("password")
        .notEmpty().withMessage("Password is required")

];

export const requestPasswordResetValidation = [
    body("email")
        .notEmpty().withMessage("Email is required").bail()
        .isEmail().withMessage("Please provide a valid email")
        .toLowerCase().trim(),
];

export const verifyOTPValidation = [
    body("email")
        .notEmpty().withMessage("Email is required").bail()
        .isEmail().withMessage("Please provide a valid email")
        .toLowerCase().trim(),

    body("otp").notEmpty().withMessage("OTP is required")
];

export const resetPasswordValidation = [
    body("email")
        .notEmpty().withMessage("Email is required").bail()
        .isEmail().withMessage("Please provide a valid email")
        .toLowerCase().trim(),

    body("newPassword").notEmpty().withMessage("New Password is required")
];

export const addCategoryValidation = [
    body("name").notEmpty().withMessage("category Name is required"),
];


export const createOrderValidation = [
    // body("userId").notEmpty().withMessage("User Id is required"),
    body("productId").notEmpty().withMessage("Product Id is required"),
    body("quantity").notEmpty().isNumeric().withMessage("quantity is required and must be a number"),
    body("shippingAddress")
        .isObject().withMessage("Shipping address must be an object").bail()
        .custom((value) => {
            if (!value.country || !value.address) {
                throw new Error("Country and area address is required");
            }
            return true;
        }),
];

export const addReviewValidation = [
    body("reviewFor").notEmpty().withMessage("review For is required"),
    body("rating")
        .notEmpty()
        .withMessage("Rating is required").bail()
        .isNumeric()
        .withMessage("Rating must be a number")
        .bail()
        .custom((value) => {
            if (value < 1 || value > 5) {
                throw new Error("Rating must be between 1 and 5");
            }
            return true;
        }),

    body("comment")
        .optional()
        .isString()
        .withMessage("Comment must be a string")
];