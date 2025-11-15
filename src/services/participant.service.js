import participantRepository from "../repositories/participant.repository.js";

class ParticipantService {
  async createParticipant(data) {
    if (!data.firstName || !data.email) {
      const err = new Error("Invalid payload");
      err.status = 400;
      throw err;
    }

    const existing = await participantRepository.findByEmail(data.email);
    if (existing) {
      const err = new Error("Email already registered");
      err.status = 409;
      throw err;
    }

    return participantRepository.create(data);
  }

  async listParticipants() {
    return participantRepository.findAll();
  }
}

export default new ParticipantService();
