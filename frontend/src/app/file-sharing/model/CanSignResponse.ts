export class CanSignResponse {
    public Performed: boolean;
    public UserId: string;
    public DisplayName: string;
    public CanSign: boolean;
    public IsQualified: boolean;
    public SavePath: string;

    constructor(data?: any) {
        if (data) { Object.assign(this, data); }
    }
}
