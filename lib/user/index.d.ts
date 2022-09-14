import { Response, User } from "@/types";
declare function getProfile(): Promise<User | Response>;
export { getProfile };
