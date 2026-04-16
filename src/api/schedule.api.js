import { api } from "./client";

export const scheduleApi = {
  getWeeklySchedules: (courseId) => {
    return api.get(`/courses/${courseId}/weekly-schedules`);
  },

  getTimeSlots: (courseId, weeklyScheduleId) => {
    return api.get(
      `/courses/${courseId}/time-slots?weekly_schedule_id=${weeklyScheduleId}`,
    );
  },

  getSessionTypes: (courseId, weeklyScheduleId, timeSlotId) => {
    return api.get(
      `/courses/${courseId}/session-types?weekly_schedule_id=${weeklyScheduleId}&time_slot_id=${timeSlotId}`,
    );
  },
};
