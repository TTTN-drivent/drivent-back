import { cannotBookingError, notFoundError } from "@/errors";
import roomRepository from "@/repositories/room-repository";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import tikectRepository from "@/repositories/ticket-repository";
import { BookingResponse } from "@/protocols";

async function checkEnrollmentTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw cannotBookingError();
  }
  const ticket = await tikectRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotBookingError();
  }
}

async function checkValidBooking(roomId: number) {
  const room = await roomRepository.findById(roomId);
  const bookings = await bookingRepository.findByRoomId(roomId);

  if (!room) {
    throw notFoundError();
  }
  if (room.capacity <= bookings.length) {
    throw cannotBookingError();
  }
}

async function getBooking(userId: number) {
  const userBooking = await bookingRepository.findByUserId(userId);

  if (!userBooking) {
    throw notFoundError();
  }

  const roomBookings = await bookingRepository.findByRoomId(userBooking.roomId);

  const response: BookingResponse = {
    Booking: {
      id: userBooking.id,
      userId: userBooking.userId,
      roomId: userBooking.roomId 
    },
    Room: {
      id: userBooking.Room.id,
      name: userBooking.Room.name,
      capacity: userBooking.Room.capacity,
      roomBookings: roomBookings.length,
      hotelId: userBooking.Room.hotelId
    },
    Hotel: {
      id: userBooking.Room.Hotel.id,
      name: userBooking.Room.Hotel.name,
      image: userBooking.Room.Hotel.image
    }
  };

  return response;
}

async function bookingRoomById(userId: number, roomId: number) {
  await checkEnrollmentTicket(userId);
  await checkValidBooking(roomId);

  const booking = await bookingRepository.findByUserId(userId);

  if (booking) {
    throw cannotBookingError();
  }

  return bookingRepository.create({ roomId, userId });
}

async function changeBookingRoomById(userId: number, roomId: number) {
  await checkValidBooking(roomId);
  const booking = await bookingRepository.findByUserId(userId);

  if (!booking || booking.userId !== userId) {
    throw cannotBookingError();
  }

  return bookingRepository.upsertBooking({
    id: booking.id,
    roomId,
    userId
  });
}

const bookingService = {
  bookingRoomById,
  getBooking,
  changeBookingRoomById,
};

export default bookingService;
