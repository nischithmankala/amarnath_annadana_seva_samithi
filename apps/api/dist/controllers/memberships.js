"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMembers = exports.createMember = void 0;
const config_1 = require("../config");
const createMember = async (req, res) => {
    try {
        const { name, mobile, email, address, city, category, fee } = req.body;
        const user = await config_1.prisma.user.upsert({
            where: { mobile: mobile || email },
            update: {},
            create: {
                mobile,
                email,
                role: 'MEMBER'
            }
        });
        const memberId = `MEM-${Math.floor(1000 + Math.random() * 9000)}`;
        const member = await config_1.prisma.member.create({
            data: {
                memberId,
                userId: user.id,
                name,
                mobile,
                email,
                address,
                city,
                category,
                fee,
                status: 'PENDING',
            }
        });
        res.status(201).json({ success: true, data: member });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: { message: 'Internal server error' } });
    }
};
exports.createMember = createMember;
const getMembers = async (req, res) => {
    try {
        const members = await config_1.prisma.member.findMany({
            where: { status: 'APPROVED' },
            select: {
                id: true,
                memberId: true,
                name: true,
                photoUrl: true,
                city: true,
            }
        });
        res.json({ success: true, data: members });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: { message: 'Internal server error' } });
    }
};
exports.getMembers = getMembers;
