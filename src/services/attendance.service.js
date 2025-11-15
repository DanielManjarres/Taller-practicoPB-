import eventRepository from "../repositories/event.repository.js";
import participantRepository from "../repositories/participant.repository.js";
import attendanceRepository from "../repositories/attendance.repository.js";
import cache from "../utils/cacheClient.js";

class AttendanceService {
  async registerAttendance(eventId, participantId) {
    const event = await eventRepository.findById(eventId);
    if (!event) {
      const err = new Error("Event not found");
      err.status = 404;
      throw err;
    }

    const participant = await participantRepository.findById(participantId);
    if (!participant) {
      const err = new Error("Participant not found");
      err.status = 404;
      throw err;
    }

    const existing = await attendanceRepository.exists(eventId, participantId);
    if (existing) {
      const err = new Error("Participant already registered");
      err.status = 409;
      throw err;
    }

    // Cache key
    const cacheKey = `event:${eventId}:count`;

    let count = await cache.get(cacheKey);
    if (count == null) {
      count = await attendanceRepository.countForEvent(eventId);
      await cache.set(cacheKey, String(count));
    } else {
      count = Number(count);
    }

    if (count >= event.capacity) {
      const err = new Error("Event is full");
      err.status = 400;
      throw err;
    }

    const attendance = await attendanceRepository.register(eventId, participantId);
    await cache.incr(cacheKey);

    // limpiar estadísticas
    await cache.del(`event:${eventId}:stats`);

    return attendance;
  }

  async listAttendees(eventId) {
    return attendanceRepository.findByEvent(eventId);
  }
}

export default new AttendanceService();
