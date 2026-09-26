"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicBoard = exports.getPublicEvents = void 0;
const config_1 = require("../config");
const getPublicEvents = async (req, res) => {
    try {
        const events = await config_1.prisma.event.findMany({
            where: { status: 'LIVE' },
            orderBy: { dateTime: 'asc' }
        });
        res.json({ success: true, data: events });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: { message: 'Internal server error' } });
    }
};
exports.getPublicEvents = getPublicEvents;
const getPublicBoard = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const board = await config_1.prisma.boardRecord.findMany({
            where: { year: currentYear },
            orderBy: { displayOrder: 'asc' }
        });
        res.json({ success: true, data: board });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: { message: 'Internal server error' } });
    }
};
exports.getPublicBoard = getPublicBoard;
