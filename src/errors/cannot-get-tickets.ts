import { ApplicationError } from "@/protocols";

export function cannotGetTicketsError(): ApplicationError {
  return {
    name: "cannotGetTicketsError",
    message: "Cannot get tickets!",
  };
}
