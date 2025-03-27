
import express, { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { createFaqs, deleteFaqs, editFaqs, getAllFaqs, getFaqsWithId } from "../controller/faqsController";

const faqsRoutes:Router = express.Router();

faqsRoutes.post('/create-faqs',authenticateUser,  createFaqs);
faqsRoutes.get('/',  getAllFaqs);
faqsRoutes.get('/:id',   getFaqsWithId);
faqsRoutes.put('/:id', authenticateUser, editFaqs);
faqsRoutes.delete('/:id',authenticateUser, deleteFaqs);

export default faqsRoutes;

