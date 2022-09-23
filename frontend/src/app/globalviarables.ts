import { Injectable } from "@angular/core";
@Injectable()
export class GlobalVariable {
    hasMail: boolean = true;
    sendmail: any = [];
    app: string = ''; //vPeople, vShare ecc.
    vpec: string = '';
    isVpecInstalled: boolean = true; //check if VPEC is installed
    isUserAdmin: boolean = false;
    dataAllFiles: any = [];
    addressIp:string = '';  
    status_done: number = 200; //services -> status success
}
