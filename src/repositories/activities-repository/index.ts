import { prisma } from "@/config";

async function listRegistersByActivityId(activityId: number) {
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

const activitiesRepository = {
  listRegistersByActivityId,
  listRegistersByUserId,
  createRegister,
  listActivity
};

export default activitiesRepository;
