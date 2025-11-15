/**
 * @jest-environment node
 */

import attendanceService from "../../src/services/attendance.service.js";
import eventRepository from "../../src/repositories/event.repository.js";
import participantRepository from "../../src/repositories/participant.repository.js";
import attendanceRepository from "../../src/repositories/attendance.repository.js";
import cache from "../../src/utils/cacheClient.js";

// Mockear todos los repositorios y redis
jest.mock("../../src/repositories/event.repository.js");
jest.mock("../../src/repositories/participant.repository.js");
jest.mock("../../src/repositories/attendance.repository.js");
jest.mock("../../src/utils/cacheClient.js");

describe("AttendanceService - registerAttendance", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Debe lanzar error si el evento no existe", async () => {
    eventRepository.findById.mockResolvedValue(null);

    await expect(
      attendanceService.registerAttendance("e1", "p1")
    ).rejects.toThrow("Event not found");
  });

  test("Debe lanzar error si el participante no existe", async () => {
    eventRepository.findById.mockResolvedValue({ id: "e1", capacity: 10 });
    participantRepository.findById.mockResolvedValue(null);

    await expect(
      attendanceService.registerAttendance("e1", "p1")
    ).rejects.toThrow("Participant not found");
  });

  test("Debe evitar doble registro", async () => {
    eventRepository.findById.mockResolvedValue({ id: "e1", capacity: 10 });
    participantRepository.findById.mockResolvedValue({ id: "p1" });
    attendanceRepository.exists.mockResolvedValue(true);

    await expect(
      attendanceService.registerAttendance("e1", "p1")
    ).rejects.toThrow("Participant already registered");
  });

  test("Debe indicar que el evento está lleno", async () => {
    eventRepository.findById.mockResolvedValue({ id: "e1", capacity: 1 });
    participantRepository.findById.mockResolvedValue({ id: "p1" });
    attendanceRepository.exists.mockResolvedValue(false);
    cache.get.mockResolvedValue("1"); // 1 == capacity → full

    await expect(
      attendanceService.registerAttendance("e1", "p1")
    ).rejects.toThrow("Event is full");
  });

  test("Debe registrar asistencia correctamente (sin cache previo)", async () => {
    eventRepository.findById.mockResolvedValue({ id: "e1", capacity: 5 });
    participantRepository.findById.mockResolvedValue({ id: "p1" });
    attendanceRepository.exists.mockResolvedValue(false);

    cache.get.mockResolvedValue(null); // no existe en cache
    attendanceRepository.countForEvent.mockResolvedValue(0);

    attendanceRepository.register.mockResolvedValue({
      id: "a1",
      eventId: "e1",
      participantId: "p1",
    });

    const result = await attendanceService.registerAttendance("e1", "p1");

    expect(result).toEqual({
      id: "a1",
      eventId: "e1",
      participantId: "p1",
    });

    expect(cache.set).toHaveBeenCalledWith("event:e1:count", "0");
    expect(cache.incr).toHaveBeenCalledWith("event:e1:count");
    expect(cache.del).toHaveBeenCalledWith("event:e1:stats");
  });

  test("Debe registrar asistencia correctamente (con cache)", async () => {
    eventRepository.findById.mockResolvedValue({ id: "e1", capacity: 3 });
    participantRepository.findById.mockResolvedValue({ id: "p1" });
    attendanceRepository.exists.mockResolvedValue(false);

    cache.get.mockResolvedValue("1"); // 1 asistente en cache

    attendanceRepository.register.mockResolvedValue({
      id: "a1",
      eventId: "e1",
      participantId: "p1",
    });

    const result = await attendanceService.registerAttendance("e1", "p1");

    expect(result.id).toBe("a1");
    expect(cache.incr).toHaveBeenCalledWith("event:e1:count");
    expect(cache.del).toHaveBeenCalledWith("event:e1:stats");
  });
});

describe("AttendanceService - listAttendees", () => {
  test("Debe retornar asistentes del evento", async () => {
    attendanceRepository.findByEvent.mockResolvedValue([
      { id: "a1", participantId: "p1" },
    ]);

    const attendees = await attendanceService.listAttendees("e1");

    expect(attendees).toEqual([{ id: "a1", participantId: "p1" }]);
  });
});
