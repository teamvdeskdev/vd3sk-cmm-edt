export class ListFeedersResponse {
    public Performed: boolean;
    public Dto: ListFeeders[];
}

export class ListFeeders {
    public id: number;
    public userId: string;
    public description: string;
    public url: string;
    public addedAt: number;
}
