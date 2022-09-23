export class ServiceSettingsResponse {
  public Performed: boolean;
  public Dto: ServiceSettings;
}

export class ServiceSettings {
  ServiceUrl: string;
  guacUser: string;
  guacPassword: string;
  AuthenticationType?: string[];
}
