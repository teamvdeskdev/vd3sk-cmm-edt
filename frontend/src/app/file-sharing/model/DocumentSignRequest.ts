import { DocInfo, OtpRequested } from './DocumentSignResponse';
import { SupportedSignatureEnum } from './SignatureDto';

export class DocumentSignRequest {
    public AccountId: number;
    public MimeType: string;
    public Document: any; // doc id | streamb64
    public SavePath: string; // path where the signed file will be saved
    public Params: DocumentSignParam;
}

export class DocumentSignParam {
    public format: SupportedSignatureEnum;
    public fileName: string;
    public returnder: boolean;
    public invisibleSignature?: boolean;
    public docInfo?: DocInfo;
    public otpRequested?: OtpRequested;
    public otp?: string;
    public annotations?: AnnotationSignature;
    public imageOnly?: boolean;
    public keepSingleFile = false;
    public fsSave = false;
    public userid?: string;
    public certid?: string;
    public requiredMark?: boolean;
}

export class AnnotationSignature {
    public position?: PositionParam[];
    public contact?: InputParam;
    public reason?: InputParam;
    public location?: InputParam;
    public image?: ImageParam;
}

export class PositionParam {
    public page: number;
    public posX: number;
    public posY: number;
    public width: number;
    public height: number;
}

export class InputParam {
    public type: string;
    public value: string;
}

export class ImageParam {
    public mimeType: string;
    public data: string;
}
