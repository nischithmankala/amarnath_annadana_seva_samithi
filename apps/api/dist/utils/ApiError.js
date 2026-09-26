"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
const contracts_1 = require("@samithi/contracts");
class ApiError extends Error {
    statusCode;
    errorCode;
    isOperational;
    constructor(statusCode, errorCode = contracts_1.ErrorCodes.INTERNAL_SERVER_ERROR, message = 'Something went wrong', isOperational = true, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.ApiError = ApiError;
