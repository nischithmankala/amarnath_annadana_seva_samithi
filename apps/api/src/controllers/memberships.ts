import { Request, Response } from 'express';
import { prisma } from '../config';

export const createMember = async (req: Request, res: Response) => {
  try {
    const { name, mobile, email, address, city, category, fee } = req.body;

    const user = await prisma.user.upsert({
      where: { mobile: mobile || email },
      update: {},
      create: {
        mobile,
        email,
        role: 'MEMBER'
      }
    });

    const memberId = `MEM-${Math.floor(1000 + Math.random() * 9000)}`;

    const member = await prisma.member.create({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
};

export const getMembers = async (req: Request, res: Response) => {
  try {
    const members = await prisma.member.findMany({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
};
