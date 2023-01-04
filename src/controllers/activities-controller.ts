import { AuthenticatedRequest } from "@/middlewares";
import activitiesService from "@/services/activities-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getActivityDates(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const dates = await activitiesService.getDates(userId);
    return res.status(httpStatus.OK).send(dates);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "PaymentRequiredError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    if (error.name === "cannotListActivitiesError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getActivityByActivityDateId(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { activityDateId } = req.params;

  try {
    const activities = await activitiesService.getActivitiesByDateId(Number(userId), Number(activityDateId));
    return res.status(httpStatus.OK).send(activities);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "PaymentRequiredError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    if (error.name === "cannotListActivitiesError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
