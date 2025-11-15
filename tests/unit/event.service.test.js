import eventService from "../../src/services/event.service.js";
import eventRepository from "../mocks/event.repository.js";
import cache from "../mocks/cacheClient.js";

// reemplazar repos y cache
vi.mock("../../src/repositories/event.repository.js", () => ({
  default: eventRepository
}));

vi.mock("../../src/utils/cacheClient.js", () => ({
  default: cache
}));

describe("EventService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("debe crear un evento", async () => {
    const mockEvent = { id: "1", title: "BMX", capacity: 10 };

    eventRepository.create.mockResolvedValue(mockEvent);

    const result = await eventService.createEvent(mockEvent);

    expect(result).toEqual(mockEvent);
    expect(eventRepository.create).toHaveBeenCalled();
  });

  test("debe fallar si falta título", async () => {
    await expect(eventService.createEvent({ capacity: 10 }))
      .rejects
      .toThrow("Invalid payload");
  });
});
