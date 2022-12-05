import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import { forbiddenError } from "@/errors/forbidden-error";

async function getBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.TicketType.isRemote || ticket.status === "RESERVED" || !ticket.TicketType.includesHotel) {
    throw notFoundError();
  }

  const booking = await bookingRepository.findBookingUserId(userId);

  if (!booking) {
    throw notFoundError();
  }

  return {
    id: booking.id,
    Room: booking.Room,
  };
}

async function bookingCreate(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw forbiddenError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.TicketType.isRemote || ticket.status === "RESERVED" || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

  const room = await bookingRepository.findRoomId(roomId);
  if (!room) {
    throw notFoundError();
  }

  if (room.Booking.length === room.capacity) {
    throw forbiddenError();
  }

  const newBooking = await bookingRepository.createNewBooking(userId, roomId);
  return newBooking;
}

async function updateBooking(BookingOldId: number, userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw forbiddenError();
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

  const BookingOld = await bookingRepository.findBookingUserId(userId);
  if (BookingOld.id !== BookingOldId || !BookingOld) {
    throw forbiddenError();
  }
  const newRoom = await bookingRepository.findRoomId(roomId);
  if (!newRoom) {
    throw notFoundError();
  }

  if (newRoom.Booking.length === newRoom.capacity) {
    throw forbiddenError();
  }

  const newBooking = await bookingRepository.createNewBooking(userId, roomId);
  await bookingRepository.deleteBooking(BookingOldId);
  return newBooking;
}

const bookingService = { getBooking, bookingCreate, updateBooking };

export default bookingService;
