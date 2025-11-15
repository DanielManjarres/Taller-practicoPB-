import prisma from "../utils/prismaClient.js";

class AttendanceRepository {
  async register(eventId, participantId) {
    return prisma.attendance.create({
      data: { eventId, participantId },
    });
  }

  async findByEvent(eventId) {
    return prisma.attendance.findMany({
      where: { eventId },
      include: { participant: true },
    });
  }

  async exists(eventId, participantId) {
    return prisma.attendance.findUnique({
      where: {
        eventId_participantId: { eventId, participantId },
      },
    });
  }

  async countForEvent(eventId) {
    return prisma.attendance.count({
      where: { eventId },
    });
  }
}

export default new AttendanceRepository();
