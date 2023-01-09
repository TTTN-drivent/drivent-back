import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import {
  getActivityDates,
  getActivityByActivityDateId,
  listActivitiesRegisters,
  getActivityLocals,
  insertRegister } from "@/controllers";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/dates", getActivityDates)
  .get("/dates/:activityDateId", getActivityByActivityDateId)
  .get("/registers/:activityId", listActivitiesRegisters)
  .get("/locals", getActivityLocals)
  .post("/", insertRegister);

export { activitiesRouter };
