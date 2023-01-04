import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import activitiesService from "@/services/activities-service/activities-service";

export async function listActivities(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const activities = await activitiesService.listActivities(userId);
    return res.status(httpStatus.OK).send(activities);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "PaymentRequiredError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}

