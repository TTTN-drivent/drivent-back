import { Hotel, PrismaClient, Room, TicketType } from "@prisma/client";
import { eventData, HotelsData, RoomsFirstHotelData, RoomsSecondHotelData, RoomsThirdHotelData, ticketTypesData } from "./seedData";
const prisma = new PrismaClient();

async function main() {
  await cleanDb();

  //Event
    const event = await prisma.event.create({
      data: eventData
    });

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
      } }))
    );

    const roomsSecondHotel = await prisma.$transaction(
      RoomsSecondHotelData.map((value) => prisma.room.create({ 
        data: {
          ...value,
          hotelId: hotels[1].id
      } }))
    );

    const roomsThridHotel = await prisma.$transaction(
      RoomsThirdHotelData.map((value) => prisma.room.create({ 
        data: {
          ...value,
          hotelId: hotels[2].id
      } }))
    );

      const rooms = [...roomsFirstHotel, ...roomsSecondHotel, ...roomsThridHotel];

  console.log({ event, ticketTypes, hotels, rooms });
}

export async function cleanDb() {
  await prisma.address.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.ticket.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.ticketType.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.hotel.deleteMany({});
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
