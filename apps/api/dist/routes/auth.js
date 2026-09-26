"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const router = (0, express_1.Router)();
router.post('/request-otp', auth_1.requestOtp);
router.post('/verify-otp', auth_1.verifyOtp);
exports.default = router;
