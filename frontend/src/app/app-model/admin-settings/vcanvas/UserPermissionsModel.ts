import { UserModel } from "src/app/flow/models/UserModel";
import { ChildConnection, ChildConnectionGroup } from "./AppsTreeModel";

export class UserPermissionsModel {
  connectionPermissions;
  connectionGroupPermissions;
  sharingProfilePermissions;
  activeConnectionPermissions;
  userPermissions;
  userGroupPermissions;
  systemPermissions: string[];
}
export class ChangePermissionModel {
  op: string; //"remove";
  path: string; //"/connectionPermissions/4";
  value = "READ";
  constructor(connection: ChildConnection | ChildConnectionGroup, op: string, type: string) {
    this.op = op;
    switch (type) {
      case "app":
        this.path = "/connectionPermissions/" + connection.identifier;
        break;
      case "group":
        this.path = "/connectionGroupPermissions/" + connection.identifier;
        break;
    }
  }
}
export class ChangePermissionModelResponse {
  Performed: boolean;
  Token: string;
}