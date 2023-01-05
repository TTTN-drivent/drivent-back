import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import activityService from "@/services/activities-service";

export async function getActivityDates(req: AuthenticatedRequest, res: Response) {
  try {
    const dates = await activityService.getDates();
    return res.status(httpStatus.OK).send(dates);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getActivityByActivityDateId(req: AuthenticatedRequest, res: Response) {
  const { activityDateId } = req.params;

  try {
    const activities = await activityService.getActivitiesByDateId(Number(activityDateId));
    return res.status(httpStatus.OK).send(activities);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

