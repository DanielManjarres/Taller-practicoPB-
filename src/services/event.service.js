import eventRepository from "../repositories/event.repository.js";
import cache from "../utils/cacheClient.js";

class EventService {
  async createEvent(data) {
    if (!data.title || !data.capacity) {
      const err = new Error("Invalid payload");
      err.status = 400;
      throw err;
    }

    const event = await eventRepository.create(data);
    await cache.del(`event:${event.id}:stats`);

    return event;
  }

  async listEvents() {
    return eventRepository.findAll();
  }

  async getEvent(id) {
    return eventRepository.findById(id);
  }

  async updateEvent(id, data) {
    const updated = await eventRepository.update(id, data);
    await cache.del(`event:${id}:stats`);
    return updated;
  }

  async deleteEvent(id) {
    await eventRepository.delete(id);
    await cache.del(`event:${id}:stats`);
  }
}

export default new EventService();
