
import { UserModel } from "./UserModel";
import { ChangePermissionModel } from "./UserPermissionsModel";


export class GroupModel {
    displayName: string;
    canAdd: boolean;
    canRemove: boolean;
    disabled: number;
    id: string;
    usercount: number;
    addedToVCanvas = false;

    permissions?: GroupPermissionsModel;

    constructor(group?: GroupModel) {
        if (!! group) {
          this.id = group.id;
        }
      }

    setPermissions(permissions: GroupPermissionsModel) {
        this.permissions = permissions;
    }
}
export class GroupPermissionsModel {
    connectionPermissions;
    connectionGroupPermissions;
    sharingProfilePermissions;
    activeConnectionPermissions;
    userPermissions;
    userGroupPermissions;
    systemPermissions: string[];
}
export class GroupRequestModel {
    identifier: string;
    users: string[];
    constructor(group: GroupModel, usersToAdd: string[]) {
        this.identifier = group.id;
        this.users = usersToAdd;
    }
}
export class CreateGroupRequestModel {
    request: GroupRequestModel;
    constructor(group: GroupModel, usersToAdd: string[]) {
        this.request = new GroupRequestModel(group, usersToAdd);
    }
}
export class GetGroupPermissionsModel {
    group: string;
    constructor(group: GroupModel) {
        this.group = encodeURIComponent(group.id);
    }
}

export class GetGroupPermissionsRequestModel {
    request: GetGroupPermissionsModel;
    constructor(group: GroupModel) {
        this.request = new GetGroupPermissionsModel(group);
    }
}
export class SetGroupPermissionsModel {
    group: string;
    permissions: ChangePermissionModel[];
    constructor(group: GroupModel, changedPermissions: ChangePermissionModel[]) {
        this.group = encodeURIComponent(group.id);
        this.permissions = changedPermissions;
    }
}
export class SetGroupPermissionsRequestModel {
    request: SetGroupPermissionsModel;
    constructor(group: GroupModel, changedPermissions: ChangePermissionModel[]) {
        this.request = new SetGroupPermissionsModel(group, changedPermissions);
    }
}
export class CreateGroupResponseModel {
    Performed: boolean;
    Token: string;
}
export class GroupResponseModel {
    identifier: string;
    attributes: {
        disabled: any;
    };
}

export class GroupListResponseModel {
    Performed: boolean;
    Dto: any;
    Token: string;
}