
import express, { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { addContactUs, deleteContactUs, getAllContactUs, getContactUsWithId } from "../controller/contactUsController";

const contactUsRoutes:Router = express.Router();

contactUsRoutes.post('/add-message',  addContactUs);
contactUsRoutes.get('/',authenticateUser,  getAllContactUs);
contactUsRoutes.get('/:id',   getContactUsWithId);
contactUsRoutes.delete('/:id',authenticateUser, deleteContactUs);

export default contactUsRoutes;

