/**
 * Model of the Share Object
 */
export class Share {
    public id: string;                          // id della condivisione
    public share_type?: number;                 // tipo della condivisione
    public uid_owner?: string;                  // id del proprietario della condivisione
    public displayname_owner?: string;          // nome del proprietario della condivisione
    public permissions?: number;                // permessi sull'oggetto condiviso
    public stime?: number;                      // durata della condivisione in millisecondi
    public parent?: number;
    public expiration?: number;
    public token?: string;
    public uid_file_owner?: string;             // come uid_owner
    public note?: string;
    public label?: string;
    public displayname_file_owner?: string;     // come displayname_owner
    public path?: string;                       // path su file system dell'oggetto condiviso
    public item_type?: string;                  // tipo dell'oggetto condiviso (folder, application, text, video, ...)
    public mimetype?: string;                   // mimetype dell'oggetto condiviso
    public storage_id?: string;
    public storage?: number;
    public item_source?: number;
    public file_source?: number;
    public file_parent?: number;
    public file_target?: string;                // come path
    public share_with?: string;                 // nome del soggetto con cui è condiviso
    public share_with_displayname?: string;     // come share_with
    public mail_send?: number;
    public hide_download?: number;
}

export class ReportModel {
    public date: string;                        //data di condivisione
    public file_name: string;                   //nome del file condiviso
    public share_type?: string;                 // tipo della condivisione
    public displayname_owner?: any;          // nome del proprietario della condivisione                 // path su file system dell'oggetto condiviso
    public item_type?: string;                  // tipo dell'oggetto condiviso (folder, application, text, video, ...)
    public share_with?: any;                 // nome del soggetto con cui è condiviso
}

