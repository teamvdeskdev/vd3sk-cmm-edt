export interface UserBackendCapabilities {
    setDisplayName: boolean;
    setPassword: boolean;
}

export interface Quota {
    free: number;
    used: number;
    total: number;
    relative: number;
    quota: number;
}

export class User {
    id: string;
    displayname: string;

    constructor() {
        this.id = '';
        this.displayname = '';
    }
}

export class CurrentUser extends User {
    address: string;
    backend: string;
    backendCapabilities: UserBackendCapabilities;
    email: string;
    enabled: boolean;
    groups: string[];
    language: string;
    lastLogin: number;
    locale: string;
    phone: string;
    quota: Quota;
    storageLocation: string;
    subadmin: [];
    twitter: string;
    website: string;

    constructor() {
        super();
        this.address = '';
        this.backend = '';
        this.backendCapabilities = { setDisplayName: true, setPassword: true };
        this.email = '';
        this.enabled = true;
        this.groups = [];
        this.language = '';
        this.lastLogin = 0;
        this.locale = '';
        this.phone = '';
        this.quota = { free: 0, used: 0, total: 0, relative: 0, quota: 0 };
        this.storageLocation = '';
        this.subadmin = [];
        this.twitter = '';
        this.website = '';
    }
}
