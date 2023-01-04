import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getActivityByActivityDateId, getActivityDates } from "@/controllers";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/dates", getActivityDates)
  .get("/:activityDateId", getActivityByActivityDateId);

export { activitiesRouter };
