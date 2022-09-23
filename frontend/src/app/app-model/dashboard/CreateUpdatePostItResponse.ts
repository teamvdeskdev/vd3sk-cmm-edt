export class CreateUpdatePostItResponse {
    public Performed: boolean;
    public Dto: PostItDto;
}

export class PostItDto {
    id: number;
    userId: string;
    displayName: string;
    title: string;
    body: string;
    isBodyHtml: boolean;
    vdata: any;
    createdAt: number;
    lastModified: number;
    completed: boolean;
    shares: any[];
    isShared: boolean;
}
