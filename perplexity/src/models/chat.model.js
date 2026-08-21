import mongoose from "mongoose"
const messageSchema = new Schema({
    chat:{
        type:Schema.Types.ObjectId,
        ref:"Chat",
        required:true
    },
    role:{
        type:String,
        enum:["User", "assistant"],
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
   
},
{timestamps:true}
);

export const Message = mongoose.model("Message",messageSchema)