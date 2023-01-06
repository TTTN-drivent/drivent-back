import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getActivityDates, getActivityByActivityDateId, listActivitiesRegisters, insertRegister } from "@/controllers";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/dates", getActivityDates)
  .get("/:activityDateId", getActivityByActivityDateId)
  .get("/registers/:activityId", listActivitiesRegisters)
  .post("/", insertRegister);

export { activitiesRouter };
