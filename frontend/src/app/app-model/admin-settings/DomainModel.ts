export class DomainResponse {
  Performed: boolean;
  Dto: Domain[];
}

export class Domain {
  id: number;
  name: string;
  active: string;
  imapHost: string;
  imapPort: number;
  imapProtocol: string;
  imapValidateCert: string;
  imapEncryption: string;
  smtpHost: string;
  smtpPort: number;
  smtpEncryption: string;
  smtpUseAuth: string;
  username: string;
  password: string;
}

export class DomainToAdd {
  name: string;
  active: string;
  imapHost: string;
  imapPort: number;
  imapProtocol: string;
  imapValidateCert: string;
  imapEncryption: string;
  smtpHost: string;
  smtpPort: number;
  smtpEncryption: string;
  smtpUseAuth: string;
  username?: string;
  password?: string;
}

export class DomainImapToAdd {
  url: string;
  type: string;
}

export class DomainImap {
  url: string;
  type: string;
}


