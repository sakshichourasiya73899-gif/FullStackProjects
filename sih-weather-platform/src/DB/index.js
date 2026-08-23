

//learn how it works every single line of codes

import mongoose from "mongoose"

const connectDB = async () => {
    try {
        console.log("URI: ", process.env.MONGO_URI)
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI)

        console.log(`MongoDB Connected: ${connectionInstance.connection.host}`)

    } catch (error) {
        console.error("MongoDB Connection Failed", error.message)
        process.exit(1)
    }
}

export default connectDB;