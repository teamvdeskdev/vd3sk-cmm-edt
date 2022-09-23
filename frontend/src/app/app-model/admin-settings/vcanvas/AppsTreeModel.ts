import { GroupModel } from "./GroupModel";
import { UserModel } from "./UserModel";

export class AppsTreeModel {
  public Performed: boolean;
  public Dto: AppsTreeModelDto;
  public Token: string;
  constructor(apiResult: AppsTreeModel, model?: UserModel | GroupModel) {
    this.Performed = apiResult.Performed;
    if ( !! model) this.Dto = new AppsTreeModelDto(apiResult.Dto, model);
    else this.Dto = new AppsTreeModelDto(apiResult.Dto, new UserModel());
    this.Token = apiResult.Token;
  }
}
export class AppsTreeModelBase {
  name: string;
  identifier: string;
  type: string;
  activeConnections: number;
  attributes: string;
  model: UserModel | GroupModel;
  constructor(api: AppsTreeModelBase, model: UserModel | GroupModel) {
    this.name = api.name;
    this.identifier = api.identifier;
    this.type = api.type;
    this.activeConnections = api.activeConnections;
    this.attributes = api.attributes;
    this.model = model;
  }
}
export class AppsTreeParentBase extends AppsTreeModelBase { 
  childConnections: ChildConnection[] = [];

  enabled = false;

  constructor(api: AppsTreeParentBase, model: UserModel | GroupModel) {
    super(api, model);
    if ( !! api.childConnections) {
      api.childConnections.forEach(cc => {
       this.childConnections.push(new ChildConnection(cc, model));
      });
    }
  }
}
export class AppsTreeChildBase extends AppsTreeModelBase {  
  parentIdentifier: string;

  enabled = false;

  constructor(api: AppsTreeChildBase, model: UserModel | GroupModel) { 
    super(api, model);
    //else super(api);
    this.parentIdentifier = api.parentIdentifier;
  }
}
export class AppsTreeModelDto extends AppsTreeParentBase {
  childConnectionGroups: ChildConnectionGroup[] = [];
  constructor(apiDto: AppsTreeModelDto, model: UserModel | GroupModel) {
    super(apiDto, model);
    if ( !! apiDto.childConnectionGroups) {
      apiDto.childConnectionGroups.forEach(ccg => {
        this.childConnectionGroups.push(new ChildConnectionGroup(ccg, model));
      });
    }
  }
}
export class ChildConnectionGroup extends AppsTreeParentBase {
  constructor(apiGroup: ChildConnectionGroup, model: UserModel | GroupModel) {
    super(apiGroup, model);  

    if ( !! model.permissions) {
      var connectionGroupPermissions = Object.keys(model.permissions.connectionGroupPermissions);
      
      if (connectionGroupPermissions.indexOf(this.identifier) > -1) {
        this.enabled = true;
      }
    }
  }
}
export class ChildConnection extends AppsTreeChildBase {  
  protocol: string;
  constructor(api: ChildConnection, model: UserModel | GroupModel) {
    super(api, model);
    this.protocol = api.protocol;
    this.parentIdentifier = api.parentIdentifier;

    if ( !! model.permissions)  {
      var connectionsPermissions = Object.keys(model.permissions.connectionPermissions);
      
      if (connectionsPermissions.indexOf(this.identifier) > -1) {
        this.enabled = true;
      }
    }
  }
}