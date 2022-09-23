export class CreateAppModel {
  parentIdentifier: string = '';
  name: string = '';
  parameters: AppParametersModel = new AppParametersModel();
  constructor(createApp?: CreateAppModel) {
    if ( !! createApp) {
      this.parentIdentifier = createApp.parentIdentifier;
      this.name = createApp.name;
      this.parameters = new AppParametersModel(createApp.parameters);
    }
  }
}
export class CreateAppRequestModel {
  request: CreateAppModel;
  constructor(createApp: CreateAppModel) {
    this.request = new CreateAppModel(createApp);
  }
}
export class CreateAppResponseModel {
  Performed: boolean;
  Token: string;
}
export class AppParametersModel {
  hostname: string = '';
  remote_app: string = '';
  remote_app_dir: string = '';
  remote_app_args: string = '';
  constructor(appParameters?: AppParametersModel) {
    if (!! appParameters) {
      this.hostname = appParameters.hostname;
      this.remote_app = appParameters.remote_app;
      this.remote_app_dir = appParameters.remote_app_dir;
      this.remote_app_args = appParameters.remote_app_args;
    }
  }
}