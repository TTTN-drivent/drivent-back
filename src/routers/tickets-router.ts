import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getTicketTypes, getTicketTypesByName, getTickets, createTicket } from "@/controllers";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/types", getTicketTypes)
  .get("/types/:ticketTypeName", getTicketTypesByName)
  .get("", getTickets)
  .post("", createTicket);

export { ticketsRouter };
