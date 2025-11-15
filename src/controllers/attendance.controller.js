import attendanceService from "../services/attendance.service.js";

export const registerAttendance = async (req, res, next) => {
  try {
    const attendance = await attendanceService.registerAttendance(
      req.params.id,
      req.body.participantId
    );

    res.status(201).json(attendance);
  } catch (err) {
    next(err);
  }
};

export const listAttendees = async (req, res, next) => {
  try {
    const attendees = await attendanceService.listAttendees(req.params.id);
    res.json(attendees);
  } catch (err) {
    next(err);
  }
};
