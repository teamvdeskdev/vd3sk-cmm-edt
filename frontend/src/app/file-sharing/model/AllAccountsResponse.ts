import { AddAccountNewDomainInterfaceBody } from 'src/app/mail/pages/settings/interfaces/api/body.interface';

export class AllAccountsResponse {
    public Performed: boolean;
    public UserId: string;
    public Dto: SignatureAccountDto[];
}

export class SignatureAccountDto {
    public Id?: number;
    public ServiceId?: number;
    public Email?: string;
    public UserId?: string;
    public Username?: string;
    public Password?: string;
    public Token?: string;
    public Identifier?: string;
    public Signature?: any;
    public RealSignature?: any;
    public MarkUsername?: string;
    public MarkPassword?: string;
}

export class AllCodesResponse {
    public status: string;
    public description: string;
    public return_code: string;
    public certificates: any;
}