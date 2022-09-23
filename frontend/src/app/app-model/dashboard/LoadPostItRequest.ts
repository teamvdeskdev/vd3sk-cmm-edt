export class LoadPostItRequest {
    public filters?: LoadFilter;
    public skip: number;
    public take: number;
}

export class LoadFilter {
    public from: number;
    public to: number;
}
