import { ApplicationError } from "@/protocols";

export function invalidTicketTypeError(): ApplicationError {
  return {
    name: "invalidTicketTypeError",
    message: "You ticket is not valid to make this solicitation!",
  };
}
