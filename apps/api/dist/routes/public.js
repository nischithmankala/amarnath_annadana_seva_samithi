"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const public_1 = require("../controllers/public");
const router = (0, express_1.Router)();
router.get('/events', public_1.getPublicEvents);
router.get('/board', public_1.getPublicBoard);
exports.default = router;
