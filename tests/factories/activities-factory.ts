import { prisma } from "@/config";
import faker from "@faker-js/faker";

export function createActivityDate() {
  return prisma.activityDate.create({
    data: {
      date: faker.date.future(),
    }
  });
}

export function createActivityLocal() {
  return prisma.activityLocal.create({
    data: {
      name: faker.name.jobType(),        
    }
  });
}

export function createActivity(activityDateId: number, activityLocalId: number) {
  return prisma.activity.create({
    data: {
      name: faker.name.firstName(),  
      capacity: 10,
      startAt: faker.date.future(),
      endAt: faker.date.future(),
      activityDateId,
      activityLocalId
    }
  });
}

export function createActivityWithNoCapacity(activityDateId: number, activityLocalId: number) {
  return prisma.activity.create({
    data: {
      name: faker.name.firstName(),  
      capacity: 0,
      startAt: faker.date.future(),
      endAt: faker.date.future(),
      activityDateId,
      activityLocalId
    }
  });
}

export function createActivityWithSpecificTime(activityDateId: number, activityLocalId: number, startAt: Date, endAt: Date) {
  return prisma.activity.create({
    data: {
      name: faker.name.firstName(),  
      capacity: 10,
      startAt,
      endAt,
      activityDateId,
      activityLocalId
    }
  });
}

export function createActivityRegister(userId: number, activityId: number) {
  return prisma.activityRegister.create({
    data: {
      userId,
      activityId
    }
  });
}
