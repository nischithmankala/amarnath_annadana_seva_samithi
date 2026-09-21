"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const contracts_1 = require("@samithi/contracts");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Request ID middleware
app.use((req, res, next) => {
    req.headers["x-request-id"] = req.headers["x-request-id"] || crypto.randomUUID();
    next();
});
// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});
// Centralized error handling
app.use((err, req, res, _next) => {
    console.error(`[Error] ${req.method} ${req.url}:`, err);
    const errorResponse = {
        success: false,
        error: {
            code: err.code || contracts_1.ErrorCodes.INTERNAL_SERVER_ERROR,
            message: err.message || "An unexpected error occurred",
        },
    };
    res.status(err.status || 500).json(errorResponse);
});
if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => {
        console.log(`API server listening on port ${port}`);
    });
}
exports.default = app;
