export class SignatureVerifyResponse {
    public Performed: boolean;
    public Verified: boolean;
    public Data: VerifyData[];
    public Error: any;
}

export class VerifyData {
    public cerVersion: string;
    public certAlgorithm: string;
    public validitySince: Date;
    public validityUntil: Date;
    public countryName: string;
    public organizationName: string;
    public commonName: string;
    public givenName: string;
    public surname: string;
    public subjectTitle: string;
    public domainQualifier: string;
    public organizationUnitName: string;
    public subjectAltName: string;
    public issuerAltName: string;
    public certSerialNumber: string;
}
