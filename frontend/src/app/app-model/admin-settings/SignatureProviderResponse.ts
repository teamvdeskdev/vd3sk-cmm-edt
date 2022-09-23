export class SignatureProviderResponse {
    public Performed: boolean;
    public UserId: string;
    public Dto: SignatureProviderDto[];
}

export class SignatureProviderDto {
    public Id: number;
    public ServiceName: string;
    public Description: string;
    public ServiceType: string;
    public ServiceUrl: string;
    public ServiceUsername: string;
    public ServicePassword: string;
    public ServiceToken: string;
    public ServiceActive: boolean;
    public ServiceHasVerify: boolean;
    public ServiceVerifyUrl: string;
    public ServiceModuleRoot: string;
    public ServiceModuleClass: string;
    public ServiceModuleClassVerify: string;
    public ServiceHasP7mPackaging: boolean;
    public ServiceSupportedSignatures: string;
    public ServiceRequireOtp: boolean;
    public isMultiSignature: boolean;
    public isMultipageSignature: boolean;
    public signatureMu: string;
    public extraParams: string;
}
