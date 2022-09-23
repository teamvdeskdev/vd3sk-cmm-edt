export class DeviceSessionResp {
    public status: string;
    public body: DeviceSessionBody[];
}

export class DeviceSessionBody {
    id: number;
    name: string;
    type: number;
    lastActivity: number;
    scope: {
        filesystem: boolean;
    };
    canDelete: boolean;
    canRename: boolean;
}
