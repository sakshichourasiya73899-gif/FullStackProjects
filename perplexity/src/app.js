import express from "express"
import helmet from "helmet"
import cors from "cors"
import morgan from "morgan"
let app = express();
app.use(helmet());
app.use(express.json())
app.get("/Health",(req,res)=>{
    res.status(200).json({status:"ok"});
})

app.use((req,res)=>{
    res.status(404).json({message:"Route not found"})
})

app.use((err,req,res,next)=>{
    console.log(err.stack)
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message:err.message||"Internal Server Error",
        ...(process.env.NODE_ENV!== "production" && {stack: err.stack})

    })
})

export default app;