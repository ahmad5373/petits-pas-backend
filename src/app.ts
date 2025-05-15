import express, { Application, Request, Response } from 'express';
const app: Application = express();
import cors from 'cors';
import connectionDB from './config/database';
import { errorHandler } from './middleware/errorHandler';
import './models'
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import reviewRoutes from './routes/reviewRoutes';
import policyRoutes from './routes/policyRoutes';
import courseRoutes from './routes/courseRoutes';
import faqsRoutes from './routes/faqsRoutes';
import contactUsRoutes from './routes/contactUsRoutes';
import appVideoRoutes from './routes/appVideosRoutes';
import couresProgressRoutes from './routes/courseProgressRoutes';


app.use(cors())
app.use(express.json())
connectionDB();

const initializeApp = async () => {
     try {
       console.log("Connecting to MongoDB...");
       await connectionDB();
       console.log("MongoDB connected successfully!");
   
     } catch (error: any) {
       console.error("Failed to initialize the application:", error.message);
       process.exit(1);
     }
   };
   
   initializeApp();

app.get("/", (req: Request, res: Response) => {
     res.send('API\'s working perfectly....');
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/category', categoryRoutes);
app.use('/reviews', reviewRoutes);
app.use('/policies', policyRoutes);
app.use('/course', courseRoutes);
app.use('/videos',appVideoRoutes);
app.use('/faqs', faqsRoutes);
app.use('/contact-us', contactUsRoutes);
app.use('/progress', couresProgressRoutes);

app.use(errorHandler);

export default app
