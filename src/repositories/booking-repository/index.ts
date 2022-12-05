import { prisma } from "@/config";

async function findBookingUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    },
  });
}

async function createNewBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

async function deleteBooking(bookingId: number) {
  return prisma.booking.delete({
    where: {
      id: bookingId,
    },
  });
}

async function findRoomId(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
    include: {
      Booking: true,
    },
  });
}

const bookingRepository = {
  findBookingUserId,
  createNewBooking,
  deleteBooking,
  findRoomId,
};

export default bookingRepository;
