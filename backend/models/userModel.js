import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name : {type:String,required:true},
    email : {type:String,required:true,unique:true},
    password : {type:String,required:true},
    cartData : {type:Object,default:{}}
},{minimize:false}) //By default, Mongoose removes empty objects from the document when saving it to MongoDB thatswhy we use this.

const userModel = mongoose.model.user || mongoose.model("user",userSchema); // if model is already created || if not then it create user collection or model

export default userModel;