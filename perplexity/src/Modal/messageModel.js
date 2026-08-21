import mongoose, { Schema } from "mongoose"
const chatSchema = new Schema({
    user:{
        type:Schema.Type.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        require:true,
        default:"New Chat"
    }
},
{timestamps:true})

export const Chat = mongoose.model("Chat",chatSchema)