import {
  cannotListActivitiesError,
  notFoundError, 
  paymentRequiredError, 
  cannotSaveActivityError, 
  conflictError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { activityCache, activityRepository } from "@/repositories/activity-repository/index";
import { Activity, ActivityDate, ActivityLocal, ActivityRegister } from "@prisma/client";

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
  let activityDates = JSON.parse(await activityCache.getActivityDates()) as ActivityDate[];
  if (!activityDates) {
    activityDates = await activityRepository.findActivityDates() as ActivityDate[];
    await activityCache.setActivityDates(activityDates);
  }
  if (!activityDates.length) {
    throw notFoundError();
  }
  return activityDates;
}

async function getActivitiesByDateId(userId: number, activityDateId: number) {
  await enrollmentTicketValidation(userId);

  let filteredActivities: Activity[] = JSON.parse(await activityCache.getActivityById(`Activity${activityDateId}`));

  if (!filteredActivities) {
    filteredActivities = await activityRepository.findActivityByDateId(activityDateId);
    await activityCache.setActivityById(filteredActivities, activityDateId);
  }

  if (!filteredActivities.length) {
    throw notFoundError();
  }
  return filteredActivities;
}

async function listRegisters(userId: number, activityId: number) {
  let activityRegisters = JSON.parse(await activityCache.getRegisters(activityId)) as ActivityRegister[];

  if (!activityRegisters) {
    activityRegisters = await activityRepository.listRegistersByActivityId(activityId);
    const userRegister = activityRegisters.find(reg => reg.userId === userId);
    const isRegistered = userRegister ? true : false;
    const registersCount = activityRegisters.length;
    await activityCache.setRegisters(activityRegisters, activityId);
    return { isRegistered, registersCount };
  }

  const userRegister = activityRegisters.find(reg => reg.userId === userId);
  const isRegistered = userRegister ? true : false;
  const registersCount = activityRegisters.length;
  return { isRegistered, registersCount };
}

async function createRegister(userId: number, activityId: number) {
  const activity = await activityRepository.listActivity(activityId);
  const userRegister = await activityRepository.listRegistersByUserId(userId);

  await enrollmentTicketValidation(userId);

  if(!activity) {
    throw notFoundError();
  }

  if(activity.capacity <= 0) {
    throw cannotSaveActivityError();
  }

  const conflict = timeConflict(activity, userRegister);

  if(conflict) {
    throw conflictError("Conflito de horário entre atividades!");
  }

  const newRegister = await activityRepository.createRegister(userId, activityId);

  await activityCache.deleteRegisters(activityId);

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

  let activityLocals = JSON.parse(await activityCache.getLocals()) as ActivityLocal[];

  if (!activityLocals) {
    activityLocals = await activityRepository.findActivityLocals();
    await activityCache.setLocals(activityLocals);
  }

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
