const asyncHandler = (fn) => {
    return (req , res, next) => {
        Promise.resolve(fn(req , res, next)).catch((err)=>next(err))
    }
}

export {asyncHandler}

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(error.code|| 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// } //this is a wrapper function used to handle error inside async route controller , it prevent from writng try, catch....in every single route
