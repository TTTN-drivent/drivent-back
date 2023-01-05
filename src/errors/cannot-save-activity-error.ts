import { ApplicationError } from "@/protocols";

export function cannotSaveActivityError(): ApplicationError {
  return {
    name: "cannotSaveActivityError",
    message: "Cannot save activity!",
  };
}
