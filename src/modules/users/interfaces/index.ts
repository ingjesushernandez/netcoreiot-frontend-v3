export interface IUser {
  _id: string;
  role: { _id: string; key: string; name: string; permissions: string[] };
  firstName?: string;
  lastName?: string;
  dni?: string;
  phone?: string;
  email: string;
  avatar?: string | null;
  isVerified?: boolean;
  isActive?: boolean;
  mqttStatus?: boolean;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateUser {
  role: string;
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  email: string;
  avatar?: string | null;
  password?: string;
}

export interface IEnable {
  isActive: boolean;
  reason?: string;
}

export interface IUpdatePass {
  oldPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface IProfileForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dni: string;
}

export interface IUserOption {
  _id: string;
  email: string;
}
