import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from './app-config';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    private configuration: AppConfig;

    constructor(
        private httpClient: HttpClient
    ) { }

    setConfig(): Promise<AppConfig> {
        return this.httpClient
            .get<AppConfig>('./assets/app-config.json')
            .toPromise()
            .then(config => this.configuration = config);
    }

    readConfig(): AppConfig {
        return this.configuration;
    }
}


export enum CustomCustomer {
    TIM = 'tim',
    ADP = 'adp', // Porto di taranto
    AUSLBO = 'auslbo' //Ausl Bologna
}
