const TryCatch = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        }
        catch (err) {
            res.status(err?.response?.status || 500).json({
                message: err?.response?.data?.message || err?.message || "Something went wrong",
            });
        }
    };
};
export default TryCatch;
