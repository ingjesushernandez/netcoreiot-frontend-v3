export interface IRole {
  _id: string;
  key: string;
  name: string;
  description?: string | null;
  permissions: string[];
  isSystem?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateRole {
  _id?: string;
  key: string;
  name: string;
  description?: string | null;
  permissions: string[];
  isSystem?: boolean;
}

export interface IPermItem {
  key: string;
  label: string;
}

export interface IPermissions {
  domain: string;
  title: string;
  items: IPermItem[];
}
