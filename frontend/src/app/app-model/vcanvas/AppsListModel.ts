export class AppsListModel {
    public Performed: boolean;
    public Dto: AppsListDto[];
    public Token: string;
}

export class AppsListDto {
    public Id: string;
    public Created: any;
    public Enabled: any;
    public Sessions: any;
    public Name: string;
    public Cluster: any;
    public Icon: string;
    public IconData: string;
}
