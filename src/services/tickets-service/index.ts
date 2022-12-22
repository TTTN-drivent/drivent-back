import { badRequestError, conflictError, notFoundError } from "@/errors";
import ticketRepository from "@/repositories/ticket-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { TicketStatus } from "@prisma/client";
import { cannotGetTicketsError } from "@/errors/cannot-get-tickets";

async function getTicketTypes() {
  const ticketTypes = await ticketRepository.findTicketTypes();

  if (!ticketTypes) {
    throw notFoundError();
  }
  return ticketTypes;
}

async function getTicketTypeByname(name: string) {
  if(!name) {
    throw badRequestError();
  }

  const ticketType = await ticketRepository.findTicketTypeByName(name);

  if (!ticketType) {
    throw notFoundError();
  }

  return ticketType;
}

async function getTicketByUserId(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw cannotGetTicketsError();
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) {
    throw notFoundError();
  }

  return ticket;
}

async function createTicket(userId: number, ticketTypeId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticketExists = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if(ticketExists) {
    throw conflictError("Not possible to create other ticket for user!");
  }

  const ticketData = {
    ticketTypeId,
    enrollmentId: enrollment.id,
    status: TicketStatus.RESERVED,
  };

  await ticketRepository.createTicket(ticketData);

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  return ticket;
}

const ticketService = {
  getTicketTypes,
  getTicketTypeByname,
  getTicketByUserId,
  createTicket,
};

export default ticketService;
