import express, { Router } from "express";
import { addPolicy, getPolicy } from "../controller/policyController";
import { authenticateUser } from "../middleware/authMiddleware";


const policyRoutes:Router = express.Router();

policyRoutes.post("/:type", authenticateUser, addPolicy);
policyRoutes.get("/:type", getPolicy); 

export default policyRoutes;
