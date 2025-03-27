import * as express from 'express'
import { Router } from 'express';
import { adminLogin, login, registerUser, requestPasswordReset, resetPassword, verifyOTP } from '../controller/userController';
import { loginValidation, registerUserValidation, requestPasswordResetValidation, requestValidation, resetPasswordValidation, verifyOTPValidation } from '../validation';

const authRoutes:Router = express.Router();

authRoutes.post('/register',registerUserValidation, requestValidation, registerUser);
authRoutes.post('/login',loginValidation, requestValidation, login);
authRoutes.post('/login-admin',loginValidation, requestValidation, adminLogin);
authRoutes.post('/request-password-reset' ,requestPasswordResetValidation, requestValidation, requestPasswordReset);
authRoutes.post('/verify-otp' ,verifyOTPValidation, requestValidation, verifyOTP);
authRoutes.post('/reset-password', resetPasswordValidation, requestValidation , resetPassword);

export default authRoutes ;