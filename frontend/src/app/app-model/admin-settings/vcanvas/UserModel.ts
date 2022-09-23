import { UserPermissionsModel } from "./UserPermissionsModel";

export class UserModelResponse {
  public Performed: boolean;
  public Dto: UserPermissionsModel;
  public Token: string;
}
export class UserModel {
  username: string = '';
  groups: string[] = [];
  permissions?: UserPermissionsModel;

  constructor(apiUser?: UserModel) {
    if (!! apiUser) {
      this.username = apiUser.username;
      this.groups = apiUser.groups;
    }
  }
  setPermissions(userPermissions: UserPermissionsModel) {
    this.permissions = userPermissions;
  }
}
export class UserModelOcsData {
  enabled: boolean;
  storageLocation: string;
  id: string;
  lastLogin: number;
  backend: string;
  subadmin: [];
  quota: any;
  email: null;
  displayname: string;
  phone: string;
  address: string;
  website: string;
  twitter: string;
  groups: string[];
  language: string;
  locale: string;
  backendCapabilities: any;
}