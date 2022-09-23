import { LanguageService } from "src/app/app-services/language.service";

export class SmtpSettingsModel {
    mail_smtpmode = "smtp";
    mail_smtpsecure: string;
    mail_sendmailmode = "smtp";
    mail_from_address: string;
    mail_domain: string;
    mail_smtpauthtype: string;
    mail_smtpauth: boolean | string;
    mail_smtphost = "";
    mail_smtpport = "";
    constructor() {
        this.mail_from_address = "";
        this.mail_domain = "";
        this.mail_smtpsecure = "";
        this.mail_smtpauthtype = "";
        this.mail_smtpauth = false;
    }
    setFromApi(api) {
        this.mail_from_address = api.mail_from_address;
        this.mail_domain = api.mail_domain;
        this.mail_smtpsecure = api.mail_smtpsecure;
        this.mail_smtpauthtype = api.mail_smtpauthtype;
        this.mail_smtpauth = (api.mail_smtpauth === 1) ? true: false;
        this.mail_smtphost = api.mail_smtphost;
        this.mail_smtpport = api.mail_smtpport;
        this.setMail(api);
    }
    
    setMail(api) {
        this.mail_from_address = api.mail_from_address + '@' + api.mail_domain;
    }
    getSave(secureSelected = "", authtypeSelected = "") {

        var smtpSettingsToSave = Object.assign({}, this);
        var exploded = this.mail_from_address.split('@');
        smtpSettingsToSave.mail_from_address = exploded[0];
        smtpSettingsToSave.mail_domain = exploded[1];
        smtpSettingsToSave.mail_smtpsecure = secureSelected;
        smtpSettingsToSave.mail_smtpauthtype = authtypeSelected;
        smtpSettingsToSave.mail_smtpauth = (this.mail_smtpauth === true) ? "1": "0";

        return smtpSettingsToSave;
    }
}
export class SmtpGetSettingsModel {
    mail_smtpmode: string;
    mail_smtpsecure: string;
    mail_sendmailmode: string;
    mail_from_address: string;
    mail_domain: string;
    mail_smtpauthtype: string;
    mail_smtpauth: boolean | string;
    mail_smtphost: string;
    mail_smtpport: string;
    mail_smtpname: string;
    mail_smtppassword: string;
}
export class SmtpCredentialsModel {
    mail_smtpname = "";
    mail_smtppassword = "";
}


export class SmtpSettingsSelect {
    private langService: LanguageService;
    secure = [];
    authtype = [];
    
    constructor() {
        this.langService = new LanguageService();

        this.secure = [
            {value: "", label: this.langService.dictionary.none},
            {value: "ssl", label: this.langService.dictionary.smtpSslTls},
            {value: "tls", label: this.langService.dictionary.smtpStartTls},
    
        ];
        this.authtype = [
            {value: "", label: this.langService.dictionary.none},
            {value: "LOGIN", label: this.langService.dictionary.smtpLogin},
            {value: "PLAIN", label:  this.langService.dictionary.smtpPlain},
            {value: "NTLM", label: this.langService.dictionary.smtpNtlm},
        ];
    }
}