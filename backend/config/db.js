import mongoose from "mongoose";

 export const connectDB = async ()=>{
    await mongoose.connect('mongodb+srv://mayankmehta880:1CWHDYUi0tRAbEKy@cluster0.wntds.mongodb.net/food-del').then(()=>console.log("DB connected"));
}