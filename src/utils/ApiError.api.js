//t’s a custom error handler class — used to create structured, consistent error objects across your backend.
// Instead of throwing plain errors like throw new Error("Failed"),
// you can throw meaningful errors like:

class ApiErrorapi extends Error { // Error is class defined by nodejs , that  class is being extended here
    constructor(
        statusCode,
        message = "Spmething went wrong", //default message
        errors = [], //array for all errors occured
        stack = ""
    ){ 
        super(message) //calling Error constructor , overriting
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiErrorapi}