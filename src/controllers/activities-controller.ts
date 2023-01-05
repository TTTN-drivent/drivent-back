import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import activitiesService from "@/services/activities-service/index";

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

export async function listActivitiesRegisters(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const activityId = Number(req.params.activityId);

  try {
    const activityRegister = await activitiesService.listRegisters(userId, activityId);
    return res.status(httpStatus.OK).send(activityRegister);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function insertRegister(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const activityId = Number(req.body.activityId);

  try {
    await activitiesService.createRegister(userId, activityId);
    return res.sendStatus(httpStatus.CREATED); 
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if(error.name === "cannotSaveActivityError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    return res.sendStatus(httpStatus.CONFLICT);
  }
}
