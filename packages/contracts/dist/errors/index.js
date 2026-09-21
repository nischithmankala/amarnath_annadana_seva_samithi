"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCodes = void 0;
var ErrorCodes;
(function (ErrorCodes) {
    ErrorCodes["UNAUTHORIZED"] = "UNAUTHORIZED";
    ErrorCodes["FORBIDDEN"] = "FORBIDDEN";
    ErrorCodes["NOT_FOUND"] = "NOT_FOUND";
    ErrorCodes["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    ErrorCodes["INTERNAL_SERVER_ERROR"] = "INTERNAL_SERVER_ERROR";
    ErrorCodes["RATE_LIMITED"] = "RATE_LIMITED";
})(ErrorCodes || (exports.ErrorCodes = ErrorCodes = {}));
