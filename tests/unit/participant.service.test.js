import participantService from "../../src/services/participant.service.js";
import participantRepository from "../mocks/participant.repository.js";

vi.mock("../../src/repositories/participant.repository.js", () => ({
  default: participantRepository
}));

describe("ParticipantService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("debe crear un participante", async () => {
    const data = { firstName: "Ana", email: "ana@mail.com" };
    participantRepository.findByEmail.mockResolvedValue(null);
    participantRepository.create.mockResolvedValue(data);

    const result = await participantService.createParticipant(data);

    expect(result).toEqual(data);
  });

  test("no permite duplicar email", async () => {
    participantRepository.findByEmail.mockResolvedValue({ id: "1" });

    await expect(
      participantService.createParticipant({ firstName: "Ana", email: "ana@mail.com" })
    ).rejects.toThrow("Email already registered");
  });
});
