import { User } from "./schema";

export function decodeToken(token: string): User {
  const payload = JSON.parse(atob(token.split(".")[1]));

  return {
    id: payload.id,
    name: payload.name,
    email: payload.email,
    role: payload.role,
    registration: payload.registration,
  };
}
