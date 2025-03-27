import mongoose from "mongoose";
 console.log('process.env.MONGO_RUI  ', process.env.MONGO_URI);
const connectionDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`Mongo DB connected ${conn.connection.host}`);
    } catch (error) {
        console.log("error While connecting to Database",error);
        process.exit();
    }
};
export default connectionDB;