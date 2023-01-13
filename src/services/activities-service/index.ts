import {
  cannotListActivitiesError,
  notFoundError, 
  paymentRequiredError, 
  cannotSaveActivityError, 
  conflictError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import activityRepository from "@/repositories/activity-repository";
import { Activity, ActivityRegister } from "@prisma/client";

async function enrollmentTicketValidation(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED") {
    throw paymentRequiredError();
  }

  if (ticket.TicketType.isRemote ) {
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

async function listRegisters(userId: number, activityId: number) {
  const activityRegisters = await activityRepository.listRegistersByActivityId(activityId);

  const userRegister = activityRegisters.find(reg => reg.userId === userId);
  const isRegistered = userRegister ? true : false;
  const registersCount = activityRegisters.length;
 
  return { isRegistered, registersCount };
}

async function createRegister(userId: number, activityId: number) {
  const activity = await activityRepository.listActivity(activityId);
  const userRegister = await activityRepository.listRegistersByUserId(userId);
  const activityRegisters = await activityRepository.listRegistersByActivityId(activityId);

  await enrollmentTicketValidation(userId);

  if(!activity) {
    throw notFoundError();
  }

  if(activity.capacity - activityRegisters.length <= 0) {
    throw cannotSaveActivityError();
  }

  const conflict = timeConflict(activity, userRegister);

  if(conflict) {
    throw conflictError("Conflito de horário entre atividades!");
  }

  const newRegister = await activityRepository.createRegister(userId, activityId);

  return newRegister;
}

export type userRegister = ActivityRegister & {Activity: Activity}

function timeConflict(activity: Activity, userRegisters: userRegister[]) {
  const activityStart = activity.startAt;
  const activityEnd = activity.endAt;
  let conflict = false;

  userRegisters.map( userActivity => {
    const registerStart = userActivity.Activity.startAt;
    const registerEnd = userActivity.Activity.endAt;

    const startConflict = activityStart >= registerStart && activityStart < registerEnd;
    const endConflict = activityEnd > registerStart && activityEnd <= registerEnd;
    if(startConflict || endConflict) {
      conflict = true;
    }
  } );
  return conflict;
}

async function getLocals(userId: number) {
  await enrollmentTicketValidation(userId);

  const activityLocals = await activityRepository.findActivityLocals();
  if (!activityLocals.length) {
    throw notFoundError();
  }
  return activityLocals;
}

const activitiesService = {
  getDates,
  getActivitiesByDateId,
  listRegisters,
  createRegister,
  getLocals
};

export default activitiesService;
