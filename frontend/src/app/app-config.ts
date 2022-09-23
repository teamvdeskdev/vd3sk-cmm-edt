export interface AppConfig {
    endpoint: string;
    vpecEndpoint: string;
    vcalEndpoint: string;

    vCanvasEndpoint: string;
    vFlowEndpoint: string;
    vFlowmanagerEndpoint: string;
    vMeetEndpoint: string;
    vMeetLink: string;
    vDocEndpoint: string;
    enableVshare: boolean;
    enableVpec: boolean;
    enableVcal: boolean;
    enableVcanvas: boolean;
    enableVFlow: boolean;
    enableVDoc: boolean;
    enableVmeet: boolean;
    enableVdpa: boolean;
    enableV2fa: boolean;
    enableChat: boolean;
    isDev: boolean;
    custom_FE: string;
    custom_color: string;
    custom_logo: string;
    custom_logo_login: string;
    custom_fontColor: boolean;
    mobile_folder: string;
    enableSaml: boolean;
    disableDelete: boolean;
    customCustomer: string;
    secondsToIdleTime: number; // if it is 0 the inactivity time will be automatically set to 1200
    enableCalendar365: boolean;
    enableSchedule: boolean;
    expAdminMail: string;
    customerEndpoint: string;
    enableStagingArea: boolean;
}
