"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const contracts_1 = require("@samithi/contracts");
const logger_1 = require("../utils/logger");
const errorHandler = (err, req, res, _next) => {
    const statusCode = err.statusCode || 500;
    const errorCode = err.errorCode || err.code || contracts_1.ErrorCodes.INTERNAL_SERVER_ERROR;
    logger_1.logger.error(`[Error] ${req.method} ${req.url}`, {
        error: err.message,
        code: errorCode,
        stack: err.stack,
        requestId: req.headers['x-request-id']
    });
    const errorResponse = {
        success: false,
        error: {
            code: errorCode,
            message: err.message || 'An unexpected error occurred',
        },
    };
    res.status(statusCode).json(errorResponse);
};
exports.errorHandler = errorHandler;
