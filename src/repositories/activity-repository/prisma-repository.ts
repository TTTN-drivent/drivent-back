import { prisma } from "@/config";
import { ActivityDate, ActivityRegister } from "@prisma/client";

async function findActivityDates(): Promise<ActivityDate[]>  {
  return await prisma.activityDate.findMany();
}

async function findActivityByDateId(activityDateId: number) {
  return await prisma.activity.findMany({
    where: {
      activityDateId
    },
    include: {
      ActivityLocal: true
    },
    orderBy: {
      startAt: "asc",
    }
  });
}

async function listRegistersByActivityId(activityId: number): Promise<ActivityRegister[]> {
  return prisma.activityRegister.findMany({
    where: {
      activityId,
    }
  });
}

async function listRegistersByUserId(userId: number) {
  return prisma.activityRegister.findMany({
    where: {
      userId,
    }, include: {
      Activity: true
    }
  });
}

async function createRegister(userId: number, activityId: number) {
  return prisma.activityRegister.create({
    data: {
      userId,
      activityId
    }
  });
}

async function listActivity(activityId: number) {
  return prisma.activity.findFirst({
    where: {
      id: activityId
    }
  });
}

async function findActivityLocals() {
  return await prisma.activityLocal.findMany();
}

export const activityRepository = {
  findActivityDates,
  findActivityByDateId,
  listRegistersByActivityId,
  listRegistersByUserId,
  createRegister,
  listActivity,
  findActivityLocals
};
