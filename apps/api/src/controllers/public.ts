import { Request, Response } from 'express';
import { prisma } from '../config';

export const getPublicEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      where: { status: 'LIVE' },
      orderBy: { dateTime: 'asc' }
    });
    res.json({ success: true, data: events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
};

export const getPublicBoard = async (req: Request, res: Response) => {
  try {
    const currentYear = new Date().getFullYear();
    const board = await prisma.boardRecord.findMany({
      where: { year: currentYear },
      orderBy: { displayOrder: 'asc' }
    });
    res.json({ success: true, data: board });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
};
