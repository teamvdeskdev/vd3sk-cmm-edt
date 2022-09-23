export class UserSettingsModel {
  id: string = '';
  username: string = '';
  accountname: string = '';
  password: string = '';
  email: string = '';
  groups: any = [];
  modules: any = [];
  quota: string = '';
  quotaValue: string = '';
  image: string = '';
  hide: boolean = false;
  create: boolean = true;
}
