import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getBooking, postBooking, putBooking } from "@/controllers/booking-controller";

const bookingsRouter = Router();

bookingsRouter.all("/*", authenticateToken).get("/", getBooking).post("/", postBooking).put("/:bookingId", putBooking);

export { bookingsRouter };
