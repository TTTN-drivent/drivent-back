import {
  cannotListActivitiesError,
  notFoundError, 
  paymentRequiredError, 
  cannotSaveActivityError, 
  conflictError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import tikectRepository from "@/repositories/ticket-repository";
import activitiesRepository from "@/repositories/activities-repository";

async function listActivities(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const ticket = await tikectRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED") {
    throw paymentRequiredError();
  }

  if (ticket.TicketType.isRemote ) {
    throw cannotListActivitiesError();
  }
  return "a";
}

async function listRegisters(userId: number, activityId: number) {
  const activityRegisters = await activitiesRepository.listRegistersByActivityId(activityId);

  const userRegister = activityRegisters.find(reg => reg.userId === userId);
  const isRegistered = userRegister ? true : false;
  const registersCount = activityRegisters.length;
 
  return { isRegistered, registersCount };
}

async function createRegister(userId: number, activityId: number) {
  const activity = await activitiesRepository.listActivity(activityId);
  const userRegister = await activitiesRepository.listRegistersByUserId(userId);

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

  const newRegister = await activitiesRepository.createRegister(userId, activityId);

  return newRegister;
}

const activitiesService = {
  listActivities,
  listRegisters,
  createRegister
};

export default activitiesService;
