import mongoose from "mongoose";
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "Tazo",
        });
        console.log("connected to mongodb");
    }
    catch (error) {
        console.log(error);
    }
};
export default connectDb;
