export class VerifySignedDocumentResponse {
    public Performed: boolean;
    public Verified: boolean;
    public Data: DataVerifySignedDoc[];
    public Error: string;
}

export class DataVerifySignedDoc {
    public certDateFrom: string;
    public certDateTo: string;
    public certErrCode: string;
    public certID: string;
    public certKeyUsage: string;
    public certSerial: string;
    public certType: string;
    public digestAlg: string;
    public fiscalCode: string;
    public givenName: string;
    public orgUnit: string;
    public organization: string;
    public p7mLevel: string;
    public p7mPath: string;
    public signErrCode: string;
    public signTime: string;
    public signType: string;
    public signatureField: string;
    public surName: string;
    public timestamp: string;
    public trustErrCode: string;
    public vtrustSp: string;
    public tsAuthority: string;
    public tsLenght: string;
    public valid: string;
    public validCert: string;
    public validSign: string;
    public validTimestamp: string;
    public validTrust: string;
    public x509: string;
}
