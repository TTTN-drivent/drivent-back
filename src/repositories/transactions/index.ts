import { prisma } from "@/config";
import { Payment, Address, Enrollment } from "@prisma/client";
import paymentRepository from "../payment-repository";
import ticketRepository from "../ticket-repository";
import enrollmentRepository from "../enrollment-repository";
import addressRepository from "../address-repository";
import { exclude } from "@/utils/prisma-utils";

async function PaymentTransaction(ticketId: number, params: PaymentParams) {
  const CreatePayment = paymentRepository.createPayment(ticketId, params);

  const UpdateticketStatus = ticketRepository.ticketProcessPayment(ticketId);

  return prisma.$transaction([CreatePayment, UpdateticketStatus]);
}

async function CreateNewEnrollment(
  params: CreateOrUpdateEnrollmentWithAddress,
  enrollment: Omit<CreateOrUpdateEnrollmentWithAddress, "address">,
  address: address,
) {
  const enrollmentt = await enrollmentRepository.upsert(params.userId, enrollment, exclude(enrollment, "userId"));

  const newEnrollment = enrollmentRepository.upsert(params.userId, enrollment, exclude(enrollment, "userId"));

  const updateRepository = addressRepository.upsert(enrollmentt.id, address, address);

  return prisma.$transaction([newEnrollment, updateRepository]);
}

type address = {
  addressDetail: string;
  number: string;
  cep: string;
  street: string;
  city: string;
  state: string;
  neighborhood: string;
};

export const Transactions = {
  PaymentTransaction,
  CreateNewEnrollment,
};

export type PaymentParams = Omit<Payment, "id" | "createdAt" | "updatedAt">;
type CreateAddressParams = Omit<Address, "id" | "createdAt" | "updatedAt" | "enrollmentId">;
type CreateEnrollmentParams = Omit<Enrollment, "id" | "createdAt" | "updatedAt">;
type CreateOrUpdateEnrollmentWithAddress = CreateEnrollmentParams & {
  address: CreateAddressParams;
};
