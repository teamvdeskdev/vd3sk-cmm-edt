export class SignatureDto {
    public accountId: number;
    public serviceId: number;
    public signatureServiceIdentifier: string;
    public signatureServiceName: string;
    public signatureHasP7mPackaging: boolean;
    public signatureUserId: string;
    public signatureUserEmail: string;
    public signatureSupportedSignatures: Array<SupportedSignatureEnum>;
    public requireOTP: boolean;
    public signatureMu: string;
    public isMultiSignature: boolean;
    public isMultipageSignature: boolean;
    public extraParams: ExtraParamsSignature;
}

export const enum SupportedSignatureEnum {
    CADES = 'CADES',
    PADES = 'PADES',
    XADES = 'XADES'
}

export class ExtraParamsSignature {
    public typeOtpAuth: string;
    public ArssType: string;
    public signOrientation: string;
}
