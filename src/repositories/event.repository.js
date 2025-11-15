import prisma from "../utils/prismaClient.js";

class EventRepository {
  async create(data) {
    return prisma.event.create({ data });
  }

  async findAll() {
    return prisma.event.findMany();
  }

  async findById(id) {
    return prisma.event.findUnique({ where: { id } });
  }

  async update(id, data) {
    return prisma.event.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return prisma.event.delete({ where: { id } });
  }
}

export default new EventRepository();
