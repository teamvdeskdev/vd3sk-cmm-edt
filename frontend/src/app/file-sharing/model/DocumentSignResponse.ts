export class DocumentSignResponse {
    public NotSignedBecause: string;
    public OriginalDocument: any;
    public OriginalFileName: string;
    public OriginalMimeType: string;
    public Performed: boolean;
    public Properties: DocumentSignRespProp;
    public SessionToken: string;
    public Signed: boolean;
    public SignedDocument: any;
    public SignedMimeType: any;

    constructor(data?: any) {
        if (data) { Object.assign(this, data); }
    }
}

export class DocumentSignRespProp {
    public docInfo: DocInfo;
    public otpRequested: OtpRequested;
}

export class DocInfo {
    public authzToken: string;
    public date: number;
    public id: string;
    public idCollection: string;
    public name: string;
    public url: string;
    public viewer: boolean;
    public viewerUrl: string;
}

export class OtpRequested {
    public tokenRequested: boolean;
}

