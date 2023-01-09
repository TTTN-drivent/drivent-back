import { Activity, ActivityDate, Prisma, PrismaClient } from "@prisma/client";
import { activityDateData, activityLocalData, eventData, firstActivityData, HotelsData, RoomsFirstHotelData, RoomsSecondHotelData, RoomsThirdHotelData, secondActivityData, thirdActivityData, ticketTypesData } from "./seedData";

const prisma = new PrismaClient();

async function main() {
  await cleanDb();

  //Event
  let event = await prisma.event.findFirst();

  if (!event) {
    event = await prisma.event.create({
      data: eventData
    });
  }

  //TicketType
  const ticketTypes = await prisma.$transaction(
    ticketTypesData.map((value) => prisma.ticketType.create({ data: value }))
  )

  //Hotel
  const hotels = await prisma.$transaction(
    HotelsData.map((value) => prisma.hotel.create({ data: value }))
  )

  //Room
  const roomsFirstHotel = await prisma.$transaction(
    RoomsFirstHotelData.map((value) => prisma.room.create({
      data: {
        ...value,
        hotelId: hotels[0].id
      }
    }))
  );

  const roomsSecondHotel = await prisma.$transaction(
    RoomsSecondHotelData.map((value) => prisma.room.create({
      data: {
        ...value,
        hotelId: hotels[1].id
      }
    }))
  );

  const roomsThridHotel = await prisma.$transaction(
    RoomsThirdHotelData.map((value) => prisma.room.create({
      data: {
        ...value,
        hotelId: hotels[2].id
      }
    }))
  );

  const rooms = [...roomsFirstHotel, ...roomsSecondHotel, ...roomsThridHotel];

  //ActivityDates
  const activityDates = await prisma.$transaction(
    activityDateData.map((value) => prisma.activityDate.create({ data: value }))
  );

  //ActivityLocals
  const activityLocals = await prisma.$transaction(
    activityLocalData.map((value) => prisma.activityLocal.create({ data: value }))
  );

  //Activities
  const firstActivities = await prisma.$transaction(
    firstActivityData.map((value, index) => {
      if (index <= 1) {
        return prisma.activity.create({
          data: {
            ...value,
            activityDateId: activityDates[0].id,
            activityLocalId: activityLocals[0].id,
          }
        })
      } else if (index === 2) {
        return prisma.activity.create({
          data: {
            ...value,
            activityDateId: activityDates[0].id,
            activityLocalId: activityLocals[1].id,
          }
        })
      }
      return prisma.activity.create({
        data: {
          ...value,
          activityDateId: activityDates[0].id,
          activityLocalId: activityLocals[2].id,
        }
      })
    }
    ));

  const secondActivities = await prisma.$transaction(
    secondActivityData.map((value, index) => {
      if (index <= 2) {
        return prisma.activity.create({
          data: {
            ...value,
            activityDateId: activityDates[1].id,
            activityLocalId: activityLocals[0].id,
          }
        })
      }
      return prisma.activity.create({
        data: {
          ...value,
          activityDateId: activityDates[1].id,
          activityLocalId: activityLocals[2].id,
        }
      })
    }
    ));

  const thirdActivities = await prisma.$transaction(
    thirdActivityData.map((value) => {
      return prisma.activity.create({
        data: {
          ...value,
          activityDateId: activityDates[2].id,
          activityLocalId: activityLocals[0].id,
        }
      })
    }
    ));

  const activities = [...firstActivities, ...secondActivities, ...thirdActivities]

  console.log({
    event,
    ticketTypes,
    hotels,
    rooms,
    activityLocals,
    activityDates,
    activities
  });
}

export async function cleanDb() {
  await prisma.payment.deleteMany({});
  await prisma.ticket.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.ticketType.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.hotel.deleteMany({});
  await prisma.activityRegister.deleteMany({});
  await prisma.activity.deleteMany({});
  await prisma.activityLocal.deleteMany({});
  await prisma.activityDate.deleteMany({});
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });