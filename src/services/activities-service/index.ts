import {
  cannotListActivitiesError,
  notFoundError, 
  paymentRequiredError, 
  cannotSaveActivityError, 
  conflictError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import activityRepository from "@/repositories/activity-repository";

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

  if(!activity) {
    throw notFoundError();
  }

  if(activity.capacity <= 0) {
    throw cannotSaveActivityError();
  }
  /*
  comparar se tem nas atividades que ele já tá registrado alguma que bate horário com a que ele quer registrar
  provavelmente fazer uma função separada para não ficar muita coisa aqui dentro
  if(conflitoDeHorario {
    throw conflictError();
  } */

  const newRegister = await activityRepository.createRegister(userId, activityId);

  return newRegister;
}

const activitiesService = {
  getDates,
  getActivitiesByDateId,
  listRegisters,
  createRegister
};

export default activitiesService;
