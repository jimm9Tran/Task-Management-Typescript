import mongoose from "mongoose";

export const connect = async (): Promise<void> => {
    try {    
        await mongoose.connect(process.env.MONGOOSE_URL);
        console.log("done!");
    } catch (error) {
        console.log("error!");
    }
}
