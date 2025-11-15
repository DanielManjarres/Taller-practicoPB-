import prisma from "../utils/prismaClient.js";

class ParticipantRepository {
  async create(data) {
    return prisma.participant.create({ data });
  }

  async findAll() {
    return prisma.participant.findMany();
  }

  async findById(id) {
    return prisma.participant.findUnique({ where: { id } });
  }

  async findByEmail(email) {
    return prisma.participant.findUnique({ where: { email } });
  }
}

export default new ParticipantRepository();
