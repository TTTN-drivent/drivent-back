import { ApplicationError } from "@/protocols";

export function noContentError(): ApplicationError {
  return {
    name: "NoContentError",
    message: "No content found in this research!",
  };
}
