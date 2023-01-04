import { notFoundError } from "@/errors";
import activityRepository from "@/repositories/activity-repository";

async function getDates() {
  const activityDates = await activityRepository.findActivityDates();

  if (!activityDates.length) {
    throw notFoundError();
  }
  return activityDates;
}

async function getActivitiesByDateId(activityDateId: number) {
  const filteredActivities = await activityRepository.findActivityByDateId(activityDateId);

  if (!filteredActivities.length) {
    throw notFoundError();
  }
  return filteredActivities;
}

const activityService = {
  getDates,
  getActivitiesByDateId
};

export default activityService;
