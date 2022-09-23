export class ExtractSignedDocumentRequest {
    public fileId: number;
    public destinationPath: string;
}

export class ExtractSignedDocumentResponse {
    public Perfomed: boolean;
    public Dto: VerifyInnerData;
}

export class VerifyInnerData {
    public fileId: number;
    public extractedFilePath: string;
    public extractedMimeType: string;
    public existsBefore: boolean;
}