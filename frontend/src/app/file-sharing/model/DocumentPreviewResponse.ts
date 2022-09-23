export class DocumentPreviewResponse {
    public Performed: boolean;
    public Dto: DocumentPreviewResDto;
}

export class DocumentPreviewResDto {
    data: any;
    mimeType: string;
    pages: number;
}
