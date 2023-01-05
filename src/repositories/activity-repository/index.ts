import { prisma } from "@/config";

async function findActivityDates() {
  return await prisma.activityDate.findMany();
}

async function findActivityByDateId(activityDateId: number) {
  return await prisma.activity.findMany({
    where: {
      activityDateId
    },
    include: {
      ActivityLocal: true
    }
  });
}

const activityRepository = {
  findActivityDates,
  findActivityByDateId
};

export default activityRepository;
