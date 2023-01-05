import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { listActivities, listActivitiesRegisters, insertRegister } from "@/controllers";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/", listActivities)
  .get("/:activityId", listActivitiesRegisters)
  .post("/", insertRegister);

export { activitiesRouter };
