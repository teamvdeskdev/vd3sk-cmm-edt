export class SignedDocumentRootResponse {
    public Performed: boolean;
    public Dto: SignedDocumentRootDto;
}

export class SignedDocumentRootDto {
    public folderId: number;
    public folderPath: string;
}
