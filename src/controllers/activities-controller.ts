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
    if (error.name === "PaymentRequiredError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    if (error.name === "cannotListActivitiesError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    return res.sendStatus(httpStatus.CONFLICT);
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
    if(error.name === "cannotSaveActivityError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
