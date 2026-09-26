"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const memberships_1 = require("../controllers/memberships");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/', memberships_1.createMember);
router.get('/', auth_1.authenticate, memberships_1.getMembers);
exports.default = router;
