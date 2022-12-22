import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getPaymentByTicketId, paymentProcess } from "@/controllers";
import { PaymentSchema } from "@/schemas/payment-schemas";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .get("/", getPaymentByTicketId)
  .post("/process", validateBody(PaymentSchema), paymentProcess);

export { paymentsRouter };
