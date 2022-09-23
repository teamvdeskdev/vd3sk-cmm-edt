export class UpdateOnlyOfficeUrlModel {
    public status: number;
    public message: string;
    public body: UpdateOnlyOfficeBodyModel;
}

export class UpdateOnlyOfficeBodyModel {
    public documentserver: string;
    public documentserverInternal: any;
    public storageUrl: string;
    public secret: string;
    public error: string;
    public version: any;
}
