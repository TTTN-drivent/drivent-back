import { prisma } from "@/config";
import { Payment } from "@prisma/client";

async function findPaymentByTicketId(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    }
  });
}

async function findPaymentByUserId(userId: number) {
  return prisma.payment.findFirst({
    where: {
      Ticket: {
        Enrollment: {
          userId
        }
      }
    },
    include: {
      Ticket: {
        include: {
          Enrollment: true
        }
      }
    }
  });
}

async function createPayment(ticketId: number, params: PaymentParams) {
  return prisma.payment.create({
    data: {
      ticketId,
      ...params,
    }
  });
}

export type PaymentParams = Omit<Payment, "id" | "createdAt" | "updatedAt">

const paymentRepository = {
  findPaymentByTicketId,
  createPayment,
  findPaymentByUserId
};

export default paymentRepository;
