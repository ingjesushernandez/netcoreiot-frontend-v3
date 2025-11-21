import type { IRole } from "~/modules/settings/interfaces";

export interface IAuthDto {
  email?: string;
  password?: string;
  token?: string;
}

export interface ILoggedUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string | null;
  role: IRole;
  isActive: boolean;
}

export interface ILoginForm {
  email: string;
  password: string;
}
