import { cannotListActivitiesError, notFoundError, paymentRequiredError } from "@/errors";
import activityRepository from "@/repositories/activity-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function enrollmentTicketValidation(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED") {
    throw paymentRequiredError();
  }
  if (ticket.TicketType.isRemote) {
    throw cannotListActivitiesError();
  }
}

async function getDates(userId: number) {
  await enrollmentTicketValidation(userId);

  const activityDates = await activityRepository.findActivityDates();
  if (!activityDates.length) {
    throw notFoundError();
  }
  return activityDates;
}

async function getActivitiesByDateId(userId: number, activityDateId: number) {
  await enrollmentTicketValidation(userId);

  const filteredActivities = await activityRepository.findActivityByDateId(activityDateId);

  if (!filteredActivities.length) {
    throw notFoundError();
  }
  return filteredActivities;
}

const activitiesService = {
  getDates,
  getActivitiesByDateId
};

export default activitiesService;
