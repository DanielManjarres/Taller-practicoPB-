import participantService from "../services/participant.service.js";

export const createParticipant = async (req, res, next) => {
  try {
    const participant = await participantService.createParticipant(req.body);
    res.status(201).json(participant);
  } catch (err) {
    next(err);
  }
};

export const listParticipants = async (req, res, next) => {
  try {
    const list = await participantService.listParticipants();
    res.json(list);
  } catch (err) {
    next(err);
  }
};
