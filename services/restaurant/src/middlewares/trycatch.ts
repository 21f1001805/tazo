import { Request, Response,  NextFunction, RequestHandler } from "express";
const TryCatch = (handler:RequestHandler): RequestHandler =>{
    return async(req:Request, res: Response, next: NextFunction)=>{
        try {
            await handler(req,res,next)
        } catch (err:any) {
            res.status(err?.response?.status || 500).json({
                message: err?.response?.data?.message || err?.message || "Something went wrong",
            })
        }
    }
}

export default TryCatch;
