import { prisma } from "@/config";

async function findActivityDates() {
  return await prisma.activityDate.findMany();
}

async function findActivityByDateId(activityDateId: number) {
  return await prisma.activity.findMany({
    where: {
      activityDateId
    }
  });
}

const activityRepository = {
  findActivityDates,
  findActivityByDateId
};

export default activityRepository;
