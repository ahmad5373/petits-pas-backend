import * as express from 'express'
import { Router } from 'express';
import { addCategory, deleteCategory,  getAllCategories,    getSingleCategory } from '../controller/vendorController';
import { addCategoryValidation,  requestValidation } from '../validation';

const categoryRoutes:Router = express.Router();

categoryRoutes.post("/add-category", addCategoryValidation, requestValidation, addCategory);
categoryRoutes.get('/:categoryId' , getSingleCategory);
// categoryRoutes.get("/all-products/:categoryId", getAllProductByCategory);
categoryRoutes.get("/", getAllCategories);
categoryRoutes.delete('/:categoryId' , deleteCategory);



export default categoryRoutes ;
