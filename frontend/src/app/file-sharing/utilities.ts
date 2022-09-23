import { globals } from 'src/config/globals';

export class FileSharingData {
    // datas from BE
    id: number;             // string converted into int
    name: string = '';           // name file with extension
    realname: string = '';
    extension: string = '';
    realExtension: string = '';
    fileWeight: number;     // byte
    lastUpdate: number;     // timestamp in milliseconds
    tag: any;
    owner: string;          // name/id of the owner of the file/folder
    ownerName: string;      // name/id of the owner of the file/folder
    ownerHome: string;      // name of the owner of the current section
    permission: string;
    shareWith: any[];       // name of the user with whom you shared the object
    reason: string;         // used into recommendations service
    url: string;            // url for link shared
    shareTypes: any[];      // types of sharing present on file/folder

    // checks for FE
    file: boolean = false;          // check if file(true) or folder(false)
    event: boolean = false;        // check if list settings is close(false -- default) or open(true)
    favorite: boolean = false;     // check if file favorite(true) or not(false -- default)
    hide: boolean = false;          // check if file is hidden(true) or visible(false -- default)
    delete: boolean = false;       // check if file is deleted(true) or not(false -- default)
    rename: boolean = false;        // check if file is beeing renamed (false -- default)
    share: boolean = false;         // check if the file is shared (false -- default)
    preview: boolean = false;
    byOthers: boolean = false;      // check if the object is shared by others
    isRow: boolean = false;
    coded: boolean = false;         //check if element is coded
    isCoding: boolean = false;      // check for image/spin if is coding

    // elaborated BE datas
    typecomplete: string;
    type: string;          // f() -> get type of file (folder, application, text, video, ...)
    image: string;          // f() -> get name image
    classimage: string;     // f() -> get class for image color on table
    dateFunc: string;       // f() -> get last update (1 day ago, ...)
    dateReal: string;       // f() -> get last update (09/03/2020, ...)
    weight: string;         // f() -> get file weight (byte/terabyte)
    path: string;            // f() -> get file path - for delete method
    completepath: string;   // get complete path from parents
    profile_pic_url: string; // profile picture url
    crypted: boolean = false;
    isAttachment: boolean = false;
    readonly: boolean = false;
    reshare: boolean = false;
    href: string;
}

export interface FileDeletedData {
    id: number,
    deletedTimestamp: number,
    fileWeight: number,
    tag: string,
    permissions: string,
    name: string,
    realname: string,
    extension: string,
    originalPath: string,
    weight: string,
    lastUpdate: string,
    deletedTime: string,
    timepassed: string,   // get time passed from delete
    type: string,   // f() -> get type of file (folder, application, text, video, ...)
    image: string,       // f() -> get name image
    classimage: string,     // f() -> get class for image color on table
    file: boolean,
    hasPreview: boolean,
    isRow: boolean,
}

export interface ActivityData {
    id: number,
    name: string,
    type: string,
    icon: string,
    info: string,
    timestamp: number,
    humandate: string,
    passedtime: string,
    allInfo: string,
    dictType: string,
    dictInfo: string,
}

export interface LabelsList {
    id: number,
    name: string,
    canuse: boolean,
    assignable: boolean
}

export class TagsList {
    id: number;
    name: string = '';
    open: boolean = false;
    fileList: any = [];
}

export class FileByTag {
    id: string = '';
    completename: string = '';
    name: string = '';
    extension: string = '';
    path: string = '';
    weightByte: string = '';
    weightHuman: string = '';
    owner: string = '';
    image: string = '';
    imageClass: string = '';
    permissions: string = '';
    date: number;
    dateHuman: string = '';
    dateReal: string = '';
    shareTypes: any = [];
    profile: string = '';
    isFile: boolean = false;
    favorite: boolean = false;
    hide: boolean = false;
    rename: boolean = false;
    share: boolean = false;
    byOthers: boolean = false;
    checked: boolean = false;
    coded: boolean = false;
    isCoding: boolean = false;
}

export interface VersionsData {
    timestamp: number;
    date: string,
    weight: string,
    href: string,
    completehref: string,
}

export interface ArchivesData {
    backend: string,
    class: string,
    id: number,
    name: string,
    path: string,
    permissions: number,
    scope: string,
    type: string,
    dateReal: string,
    weight: string,
    image: string,
    classimage: string,
}

export interface vpecData {
    name: string,
    extension: string,
    id: number,
    isfile: boolean,
    image: string,
    classimage: string,
    size: number,
    humansize: string,
    favorite: boolean,
    ownerid: string,
    ownername: string,
    haspreview: boolean,
    isencrypted: boolean,
    sharepermissions: string,
    etag: string,
    timestamp: number,
    passedtime: string,
    humandate: string,
    homepath: string,
    typecomplete: string,
    realname: string, //name complete with []
    isAttachment: boolean,
    isConfig: boolean,
}

export interface PublicData {
    id: number,
    hide: boolean,
    rename: boolean,
    completeName: string,
    name: string,
    extension: string,
    weight: number,
    milliLastupdate: number,
    url: string,
    isfile: boolean,
    preview: boolean,
    isRow: boolean;
    typecomplete: string,
    type: string,          // f() -> get type of file (folder, application, text, video, ...)
    image: string,          // f() -> get name image
    classimage: string,     // f() -> get class for image color on table
    pastHumandate: string,       // f() -> get last update (1 day ago, ...)
    humanDate: string,       // f() -> get last update (09/03/2020, ...)
    humanWeight: string,         // f() -> get file weight (byte/terabyte)
    completepath: string,   // get complete path from parents
    permissions: any,
}

export class GroupFolder {
    id: number;
    name: string;
    groupsArray: any
    groupsObj: any;
    groups: string;
    quota: string;
    realquota: string;
    size: number;
    permissions: any;
    permissionsObj: any;
    delete: boolean = false;
    acl: boolean;
    rename: boolean = false;
    regroup: boolean = false;
}

export interface Copy {
    name: string;
    weight: string;
    date: string;
    timestamp: number;
    byte: number;
    image: string;
    classimage: string;
}

export class DuplicateFiles {
    name: string = '';
    image: string = '';
    classimage: string = '';
    dateOriginal: string = '';
    dateDuplicate: string = '';
    weightOriginal: string = '';
    weightDuplicate: string = '';
    old: boolean = false;
    new: boolean = false;
}

export class settingsUser {
    id: string = '';
    username: string = '';
    accountname: string = '';
    password: string = '';
    email: string = '';
    groups: any = [];
    modules: any = [];
    quota: string = '';
    quotaValue: string = '';
    image: string = '';
    hide: boolean = false;
    create: boolean = true;
    userManager: boolean = false;
    external: boolean;
    folderManager: boolean = false;
    role: any;
    isGuest?: boolean;
}

export class settingsSamlUser {
    id: string = '';
    username: string = '';
    accountname: string = '';
    password: string = '';
    email: string = '';
    groups: any = [];
    modules: any = [];
    quota: string = '';
    quotaValue: string = '';
    image: string = '';
    hide: boolean = false;
    create: boolean = true;
    userManager: boolean = false;
    external: boolean;
    userinfo: any = {
        dataInserimento: new Date()
    };
    folderManager: boolean = false;
    role: any;
    apps: any = [];
}

export class settingsGuest {
    id: string = '';
    name: string = '';
    surname: string = '';
    company: string = '';
    apps: any = [];
    appsString: string = ''
    custom: boolean = true;
}

export class userGuest {
    id: string = '';
    name: string = '';
    surname: string = '';
    company: string = '';
    email: string = '';
    start: string = '';
    end: string = '';
    apps: any = [];
    appsString: string = '';
    managerId: string = '';
    managerName: string = '';
    managerSurname: string = '';
    managerMail: string = '';
}

import { Dictionary } from './dictionary/dictionary';
import { stringify } from 'querystring';
import { ɵangular_packages_platform_browser_platform_browser_l } from '@angular/platform-browser';
import { ChildrenOutletContexts } from '@angular/router';
import { lastIndexOf, stubFalse, stubString } from 'lodash';

export class Utilities {
    dict = new Dictionary();
    type: any;
    image: any;
    dateFunc: any;
    dateReal: any;
    weight: any;
    path: string;

    allData = {
        audio: ['.aac', '.mid', '.midi', '.mp3', '.oga', '.ogg', '.weba', '.wav', '.opus'],
        text: ['.abw', '.doc', '.docx', '.odt', '.pages'],
        archive: ['.arc', '.bz', '.bz2', '.gz', '.rar', '.zip', '.7z', '.tar'],
        video: ['.avi', '.mpeg', '.mp4', '.ogv', '.webv', '.3gp', '.3g2'],
        ebook: ['.azw', '.epub'],
        binary: ['.bin'],
        image: ['.bmp', '.gif', '.tif', '.tiff', '.jpeg', '.jpg', '.webp', '.png'],
        hypertext: ['.htm', '.html'],
        spredsheet: ['.xls', '.xlsx', '.ods', '.numbers'],
        richtext: ['.txt', '.rtf', '.md'],
        font: ['.eot', '.woff', '.woff2', '.ttf', '.otf'],
        script: ['.csh'],
        css: ['.css'],
        csv: ['.csv'],
        icon: ['.ico'],
        xml: ['.xml', '.xhtml', '.xul',],
        calendar: ['.ics'],
        powerpoint: ['.odp', '.ppt', '.pptx', '.pps', '.ppsx', '.key'],
        coding: ['.js', '.json', '.jsonld', '.mjs', '.php', '.sh'],
        pdf: ['.pdf'],
        visio: ['.vsd'],
        compressed: ['.zip', '.rar'],
        svg: ['.svg', '.eps', '.ai'],
        p7m: ['.p7m']
    };

    //all data we need for date functional (dict, dict, timestamp)
    objDate = [
        { singular: 'year_ago', plural: 'years_ago', value: 31536000 },
        { singular: 'month_ago', plural: 'months_ago', value: 2628000 },
        { singular: 'week_ago', plural: 'weeks_ago', value: 604800 },
        { singular: 'day_ago', plural: 'days_ago', value: 86400 },
        { singular: 'hour_ago', plural: 'hours_ago', value: 3600 },
        { singular: 'minute_ago', plural: 'minutes_ago', value: 60 }
    ];

    //all data we need for file weight (dict, values in byte)
    objByte = [
        { text: 'terabyte', value: Math.pow(10, 12) },
        { text: 'gigabyte', value: Math.pow(10, 9) },
        { text: 'megabyte', value: Math.pow(10, 6) },
        { text: 'kilobyte', value: Math.pow(10, 3) },
        { text: 'byte', value: 10 }
    ];

    constructor() {
    }

    /** GET ELABORATE RESPONSE
     * Used on recents file response
     **/
    public getElaborateResponse(array) {
        let dataValue = [];

        for (var i in array) {
            let objValue = new FileSharingData();
            let sharepermissions = Number(array[i].sharepermissions);
            let isfile = (array[i].type == 'file') ? true : false;
            let name = (isfile) ? this.getNameFile(array[i].name) : array[i].name;
            if(name != 'vMeet_49ADB14325D3B5' && !(array[i].path.includes('Allegati vPEC/'))){
                let extension = this.getExtension(array[i].name, isfile);
                this.type = (isfile) ? this.getType(array[i].mimetype) : 'folder';
                let image = this.getImage(this.type, [], extension);

                let realExtension = '';
                if (extension == '.ven' || extension == '.ved') {
                    let isFileBE = (extension == '.ven') ? true : false;
                    realExtension = (isFileBE) ? this.getExtensionProtected(name.name, isFileBE) : '';
                    let type = (isFileBE) ? this.getType(realExtension) : 'folder';
                    image = this.getImage(type, [], realExtension);
                }
    
                objValue.id = parseInt(array[i].id);
                objValue.name = (isfile) ? name.name : name;
                objValue.realname = (isfile) ? name.realname : name;
                objValue.extension = extension;
                objValue.realExtension = realExtension
                objValue.fileWeight = array[i].size;
                objValue.lastUpdate = array[i].mtime;
                objValue.permission = array[i].permissions;
                objValue.file = (isfile) ? true : false;
                objValue.typecomplete = array[i].mimetype;
                objValue.type = this.type;;
                objValue.image = image.img;
                objValue.coded = (extension == '.ven' || extension == '.ved')? true : false;
                objValue.classimage = image.imgclass;
                objValue.dateFunc = this.getLastUpdateFunc(array[i].mtime);
                objValue.dateReal = this.getLastUpdateReal(array[i].mtime);
                objValue.weight = this.getWeight(array[i].size);
                objValue.path = this.getPath(array[i].path);
                objValue.reshare =  (sharepermissions < 16 ) ? false : true;
                if (array[i].shareTypes === undefined || array[i].shareTypes.length === 0) {
                    objValue.shareTypes = [];
                } else if (array[i].shareTypes.length > 0) {
                    objValue.shareTypes = array[i].shareTypes;
                }
    
                dataValue.push(objValue);
            }            
        }
        return dataValue;
    }

    /**
     * GET RESPONSE ALL FILES
     * Elaborate response service list all files
     * @param array
     */
    public getResponseAllFiles(array, username, folder) {
        var username = (!!username) ? username : '';
        var folder = (!!folder) ? folder : '';
        let dataValue = [];
        let home, homeOwner, ko = '404';

        for (let a in array) {
            let objValue = new FileSharingData();
            let path = array[a].href;
            for (let b in array[a].propstat) {
                let child = array[a].propstat[b].prop;
                if (!array[a].propstat[b].status.includes(ko)) {
                    if (!home) {
                        home = path.replace(' ', '%20');
                        homeOwner = username;
                    } else if (parseInt(child.fileid) > 0 && (child.tags.length == 0 || child.tags.tag.length == 0 || child.tags.tag.includes('SignedFile') || child.tags.tag.includes('SignedDocumentFolder') || child.tags.tag.includes('vEncryptedFile: true'))
                        && child.mounttype != 'external' && child.mounttype != 'group') {
                        let dateBE = new Date(child.getlastmodified).getTime();
                        let typeBE = child.getcontenttype;
                        let isFileBE = (child.getcontenttype) ? true : false;
                        let bytesBE = child.size;
                        let href = array[a].href.replace(home, '');
                        let nameBE = (isFileBE) ? decodeURIComponent(href) : decodeURIComponent(href).slice(0, -1);

                        let name, realname;
                        if (isFileBE) {
                            let getname = this.getNameFile(nameBE);
                            name = getname.name;
                            realname = getname.realname;
                        } else {
                            name = nameBE;
                            realname = nameBE;
                        }

                        if (!/\S+@\S+\.\S+/.test(name)) {
                            let extension = this.getExtension(nameBE, isFileBE);
                            let realExtension;
                            let type;
                            if (extension == '.ven' || extension == '.ved') {
                                isFileBE = (extension == '.ven') ? true : false;
                                realExtension = (isFileBE) ? this.getExtensionProtected(nameBE, isFileBE) : '';
                                type = (isFileBE) ? this.getType(realExtension) : 'folder';
                            } else {
                                type = (isFileBE) ? this.getType(typeBE) : 'folder';
                            }

                            let image;

                            if (Array.isArray(child.tags) || extension) {
                                image = this.getImage(this.type, child.mounttype, extension);
                            } else {
                                image = {
                                    img: (typeof child.tags.tag == 'string') ? 'folder' : 'attachment',
                                    imgclass: 'folder',
                                }
                            }

                            if (realExtension) {
                                image = this.getImage(type, [], realExtension);
                            } else {
                                if (Array.isArray(child.tags) || extension) {
                                    image = this.getImage(type, child.mounttype, extension);
                                } else {
                                    image = {
                                        img: (typeof child.tags.tag == 'string') ? 'folder' : 'attachment',
                                        imgclass: 'folder',
                                    }
                                }
                            }
                            let sharepermissions = Number(child.sharepermissions);
                            this.image = image.img;
                            this.dateFunc = this.getLastUpdateFunc(dateBE);
                            this.dateReal = this.getLastUpdateReal(dateBE);
                            this.weight = this.getWeight(bytesBE);
                            this.path = this.getAllFilesPath(array[a], folder);

                            let tags = false;
                            for (var k in child.tags.tag) {
                                if (typeof child.tags.tag[k] === 'string' || child.tags.tag[k] instanceof Array) {
                                    if ((child.tags.tag[k].includes('vPecAttachmentsFolder') && child.tags.tag[k].includes('true'))
                                        || child.tags.tag[k].includes('mailDateTime'))
                                        tags = true;
                                }
                            }

                            objValue.id = child.fileid;
                            objValue.name = name;
                            objValue.realname = realname;
                            objValue.extension = extension;
                            objValue.realExtension = (realExtension) ? realExtension : '';
                            objValue.fileWeight = bytesBE;
                            objValue.lastUpdate = dateBE;
                            objValue.tag = child.tags;
                            objValue.owner = child.ownerid;
                            objValue.ownerName = child.ownerdisplayname;
                            objValue.ownerHome = child.homeOwner;
                            objValue.permission = child.sharepermissions;
                            objValue.crypted = (Array.isArray(child.tags)) ? false : true;

                            objValue.file = (isFileBE) ? true : false;
                            objValue.favorite = (child.favorite == 1) ? true : false;
                            objValue.share = (child.mounttype == 'shared') ? true : false;
                            objValue.preview = (child.haspreview == 'true') ? true : false;
                            objValue.coded = (extension == '.ven' || extension == '.ved') ? true : false;

                            objValue.typecomplete = child.getcontenttype;
                            objValue.type = (!Array.isArray(child.mounttype) || child.mounttype != 'shared') ? child.mounttype : type;
                            objValue.image = image.img;
                            objValue.classimage = (child.tags && child.tags.tag && child.tags.tag.includes('SignedFile')) ? 'p7m' : image.imgclass;
                            objValue.dateFunc = this.getLastUpdateFunc(dateBE);
                            objValue.dateReal = this.getLastUpdateReal(dateBE);
                            objValue.weight = this.getWeight(bytesBE);
                            objValue.path = (this.path.charAt(0) == '/') ? this.path.substr(1) : this.path;
                            objValue.href = array[a].href;
                            objValue.readonly = (child.sharepermissions == '1') ? true : false;
                            objValue.reshare = (sharepermissions < 16 ) ? false : true;
                            if (child.sharetypes.length === 0) {
                                objValue.shareTypes = [];
                            } else if (child.sharetypes.sharetype !== undefined && child.sharetypes.sharetype.length > 0) {
                                objValue.shareTypes = child.sharetypes.sharetype;
                            } else {
                                objValue.shareTypes = [child.sharetypes.sharetype];
                            }
                            if (child.ownerid) {
                                objValue.profile_pic_url = `${globals.endpoint}/setting/info/avatar/getavatar?user=` + child.ownerid + `&size=30`;
                            }
                            objValue.isAttachment = tags;

                            dataValue.push(objValue);
                        }
                    }
                }
            }
        }
        return dataValue;
    }

    /**
     * GET RESPONSE ALL FILES
     * Elaborate response service list all files [Signed and External too]
     * @param array
     */
    public getResponseAll(array, username, folder) {
        var username = (!!username) ? username : '';
        var folder = (!!folder) ? folder : '';
        let dataValue = [];
        let home, homeOwner, ko = '404';

        for (let a in array) {
            let objValue = new FileSharingData();
            let path = array[a].href;
            if (!path.includes("Allegati%20vPEC")) {
                for (let b in array[a].propstat) {
                    let child = array[a].propstat[b].prop;
                    if (!array[a].propstat[b].status.includes(ko)) {
                        if (!home) {
                            home = path.replace(' ', '%20');
                            homeOwner = username;
                        } else if (parseInt(child.fileid) > 0) {
                            let dateBE = new Date(child.getlastmodified).getTime();
                            let tagBE = child.getetag;
                            let typeBE = child.getcontenttype;
                            let isFileBE = (child.getcontenttype) ? true : false;
                            let bytesBE = child.size;
                            let href = array[a].href.replace(home, '');
                            let nameBE = (isFileBE) ? decodeURIComponent(href) : decodeURIComponent(href).slice(0, -1);

                            let name, realname;
                            if (isFileBE) {
                                let getname = this.getNameFile(nameBE);
                                name = getname.name;
                                realname = getname.realname;
                            } else {
                                name = nameBE;
                                realname = nameBE;
                            }

                            if (!/\S+@\S+\.\S+/.test(name)) {
                                let extension = this.getExtension(nameBE, isFileBE);
                                this.type = (isFileBE) ? this.getType(typeBE) : 'folder';
                                let image;

                                if (Array.isArray(child.tags) || extension) {
                                    image = this.getImage(this.type, child.mounttype, extension);
                                } else {
                                    image = {
                                        img: 'folder',
                                        imgclass: 'folder',
                                    }
                                }

                                this.image = image.img;
                                this.dateFunc = this.getLastUpdateFunc(dateBE);
                                this.dateReal = this.getLastUpdateReal(dateBE);
                                this.weight = this.getWeight(bytesBE);
                                this.path = this.getAllFilesPath(array[a], folder);

                                let tags = false;
                                for (var k in child.tags.tag) {
                                    if (typeof child.tags.tag[k] === 'string' || child.tags.tag[k] instanceof Array) {
                                        if ((child.tags.tag[k].includes('vPecAttachmentsFolder') && child.tags.tag[k].includes('true'))
                                            || child.tags.tag[k].includes('mailDateTime'))
                                            tags = true;
                                    }
                                }                                

                                objValue.id = child.fileid;
                                objValue.name = name;
                                objValue.realname = realname;
                                objValue.extension = extension;
                                objValue.fileWeight = bytesBE;
                                objValue.lastUpdate = dateBE;
                                objValue.tag = tagBE;
                                objValue.owner = child.ownerid;
                                objValue.ownerName = child.ownerdisplayname;
                                objValue.ownerHome = child.homeOwner;
                                objValue.permission = child.permissions;
                                objValue.crypted = (Array.isArray(child.tags)) ? false : true;

                                objValue.file = (isFileBE) ? true : false;
                                objValue.favorite = (child.favorite == 1) ? true : false;
                                objValue.share = (homeOwner != child.ownerid) ? true : false;
                                objValue.preview = (child.haspreview == 'true') ? true : false;

                                objValue.typecomplete = child.getcontenttype;
                                objValue.type = (!Array.isArray(child.mounttype) || child.mounttype != 'shared') ? child.mounttype : this.type;
                                objValue.image = image.img;
                                objValue.classimage = image.imgclass;
                                objValue.dateFunc = this.getLastUpdateFunc(dateBE);
                                objValue.dateReal = this.getLastUpdateReal(dateBE);
                                objValue.weight = this.getWeight(bytesBE);
                                objValue.path = (this.path.charAt(0) == '/') ? this.path.substr(1) : this.path;
                                if (child.sharetypes.length === 0) {
                                    objValue.shareTypes = [];
                                } else if (child.sharetypes.sharetype !== undefined && child.sharetypes.sharetype.length > 0) {
                                    objValue.shareTypes = child.sharetypes.sharetype;
                                } else {
                                    objValue.shareTypes = [child.sharetypes.sharetype];
                                }
                                if (child.ownerid) {
                                    objValue.profile_pic_url = `${globals.endpoint}/setting/info/avatar/getavatar?user=` + child.ownerid + `&size=30`;
                                }
                                objValue.isAttachment = tags;

                                dataValue.push(objValue);
                            }
                        }
                    }
                }
            }
        }
        return dataValue;
    }

    /**
     * Get the FileSharingData from Share array in the http response
     * @param array of share objects in http response
     * @param flag string to check if the object in array are shared by others
     */
    public getShareFormattedResponse(array: any, flag: string) {
        let dataValue = [];
        const newArray = new Map();

        array.forEach(share => {
            const objValue = new FileSharingData();
            if (flag === 'openFolder') {
                const filePath = decodeURIComponent(share.href);
                share = share.propstat[0].prop;
                share.stime = new Date(share.getlastmodified).getTime() / 1000;
                const filePathArray = filePath.split('/');
                share.path = this.getSharePath(filePathArray);
                share.completename = ((filePathArray[filePathArray.length - 1]).length == 0) ? filePathArray[filePathArray.length - 2] : filePathArray[filePathArray.length - 1];
                share.item_type = ('getcontenttype' in share) ? 'file' : 'folder';
                share.mimetype = ('getcontenttype' in share) ? share.getcontenttype : '';
                share.uid_owner = share.ownerid;
                share.id = share.fileid;
                if (typeof share.favorite === 'string') {
                    share.favorite = (share.favorite === '0') ? false : true;
                }
            }

            let isfile = (share.item_type === 'file') ? true : false;
            let checkExtension = ('completename' in share) ? share.completename : share.file_target;
            let extension = (isfile) ? this.getExtension(checkExtension, isfile) : '';
            let control = (isfile) ? '' : 'folder';
            let image = this.getImage(control, [], extension);
            let sharepermissions = Number(share.permissions);

            objValue.type = (isfile) ? this.getType(share.mimetype) : 'folder';
            objValue.image = image.img;
            objValue.classimage = image.imgclass;
            objValue.dateFunc = this.getSharingTimeFunc(share.stime);
            objValue.dateReal = this.getLastUpdateReal(share.stime);

            // Populate obj
            objValue.id = share.file_source ? parseInt(share.file_source) : share.fileid;
            objValue.name = ('completename' in share) ? this.getShareNameFile(share.completename) : this.getShareNameFile(share.file_target);
            objValue.extension = extension;
            objValue.fileWeight = null;
            objValue.lastUpdate = share.stime;
            objValue.shareWith = [];
            if (share.share_with && share.share_with != share.password) { objValue.shareWith.push(share.share_with); }
            objValue.owner = (share.uid_owner != sessionStorage.user) ? share.uid_owner : '';
            objValue.permission = share.permissions;
            objValue.reshare = this.getResharePermission(sharepermissions, share);
            objValue.typecomplete = share.mimetype;
            objValue.file = isfile;
            objValue.favorite = (share.tags.includes("_$!<Favorite>!$_")) ? true : false;
            const path = share.path.replace(objValue.name + objValue.extension, '');
            objValue.path = path;

            if (flag === 'openFolder') {
                dataValue.push(objValue);
            } else if (flag === 'byYou') {
                if (share.share_with && share.share_with != share.password) {
                    objValue.profile_pic_url = `${globals.endpoint}/setting/info/avatar/getavatar?user=` + share.share_with + `&size=30`;
                }

                // If duplicate in array save share_with info and merge the object
                if (newArray.has(share.path)) {
                    const duplicate = newArray.get(share.path);
                    if (share.url !== undefined) {
                        objValue.url = share.url;
                        newArray.set(share.path, { ...objValue, ...newArray.get(share.path) });
                    } else {
                        objValue.shareWith = [...objValue.shareWith, ...duplicate.shareWith];
                        newArray.set(share.path, { ...newArray.get(share.path), ...objValue });
                    }

                } else {
                    if (share.url) objValue.url = share.url;
                    newArray.set(share.path, objValue);
                }

            } else {
                objValue.byOthers = (flag === 'byOthers') ? true : false;
                if (objValue.owner) {
                    objValue.profile_pic_url = `${globals.endpoint}/setting/info/avatar/getavatar?user=` + objValue.owner + `&size=30`;
                }

                dataValue.push(objValue);
            }
        });

        if (flag === 'byYou') {
            dataValue = Array.from(newArray.values());
        }
        return dataValue;
    }

    getResharePermission(sharepermission, share){
        if(sharepermission>16) return true;
        else if(share.uid_owner == sessionStorage.user) return true;
        else return false;
    }

    getSharePath(array) {
        let controls = false;
        let arrayPathReal = [];
        for (var a in array) {
            if (array[a].length > 0) {
                if (!controls && (array[a] == window.sessionStorage.user)) controls = true;
                else if (controls) arrayPathReal.push(array[a]);
            }
        }
        let string = arrayPathReal.join('/');
        return string;
    }

    public getResponseLabels(array, username, folderValue) {
        const folder = (folderValue) ? folderValue : '';
        const dataValue = [];
        const homeOwner = username;
        const ko = '404';

        for (const elem of array) {
            const objValue = new FileSharingData();
            const href: string = elem.href;

            for (const item of elem.propstat) {
                const child = item.prop;
                if (!item.status.includes(ko)) {
                    const dateBE = new Date(child.getlastmodified).getTime();
                    const tagBE = child.getetag;
                    const typeBE = child.getcontenttype;
                    const isFile = (child.getcontenttype) ? true : false;
                    const bytesBE = child.size;

                    this.type = (isFile) ? this.getType(typeBE) : 'folder';
                    let extension = this.getExtension(href, isFile)
                    const image = this.getImage(this.type, child.mounttype, extension);
                    this.image = image.img;
                    this.dateFunc = this.getLastUpdateFunc(dateBE);
                    this.dateReal = this.getLastUpdateReal(dateBE);
                    this.weight = this.getWeight(bytesBE);

                    objValue.id = child.fileid;
                    objValue.name = this.getLabelNameFile(href);
                    objValue.extension = extension;
                    this.path = href.replace(objValue.name + objValue.extension, '');
                    objValue.fileWeight = bytesBE;
                    objValue.lastUpdate = dateBE;
                    objValue.tag = tagBE;
                    objValue.owner = child.ownerid;
                    objValue.ownerName = child.ownerdisplayname;
                    objValue.ownerHome = child.homeOwner;
                    objValue.permission = child.permissions;
                    objValue.file = (isFile) ? true : false;
                    objValue.favorite = (child.favorite === 1) ? true : false;
                    objValue.share = (homeOwner !== child.ownerid) ? true : false;
                    objValue.preview = (child.haspreview === 'true') ? true : false;

                    objValue.typecomplete = child.getcontenttype;
                    objValue.type = (!Array.isArray(child.mounttype) || child.mounttype != 'shared') ? child.mounttype : this.type;;
                    objValue.image = image.img;
                    objValue.classimage = image.imgclass;
                    objValue.dateFunc = this.getLastUpdateFunc(dateBE);
                    objValue.dateReal = this.getLastUpdateReal(dateBE);
                    objValue.weight = this.getWeight(bytesBE);
                    objValue.path = this.path;
                    if (child.sharetypes.length === 0) {
                        objValue.shareTypes = [];
                    } else if (child.sharetypes.sharetype !== undefined && child.sharetypes.sharetype.length > 0) {
                        objValue.shareTypes = child.sharetypes.sharetype;
                    } else {
                        objValue.shareTypes = [child.sharetypes.sharetype];
                    }

                    dataValue.push(objValue);
                }
            }
        }
        return dataValue;
    }

    /**
     * GET LAST UPDATE FUNC
     * This function get a timestamp and return the time
     * past from the last update
     * @param value
     */
    public getLastUpdateFunc(value: number) {
        let nowDate = Math.trunc(Date.now() / 1000);
        let result = (value.toString().length > 10) ? (nowDate - (value / 1000)) : (nowDate - value);
        let date;
        for (let i in this.objDate) {
            let counter = Math.trunc(result / this.objDate[i].value);
            if (counter > 0) {
                date = counter + ((counter > 1) ? this.dict.getDictionary(this.objDate[i].plural) : this.dict.getDictionary(this.objDate[i].singular));
                break;
            }
        }
        if (!date) date = this.dict.getDictionary('less_minute');

        return date;
    }

    /**
     * Get the sharing time
     * @param value is sharing time  in milliseconds
     */
    public getSharingTimeFunc(value: number) {
        const nowDate = Math.trunc(Date.now() / 1000);
        const result = nowDate - value;
        let date;
        for (const item of this.objDate) {
            const counter = Math.trunc(result / item.value);
            if (counter > 0) {
                date = counter + ((counter > 1) ?
                    this.dict.getDictionary(item.plural) :
                    this.dict.getDictionary(item.singular));
                break;
            }
        }
        if (!date) { date = this.dict.getDictionary('less_minute'); }

        return date;
    }

    /**
     * GET PATH
     * This function get a file path. If not exist, return an empty string
     * @param value
     */
    public getPath(value: string) {
        return (value === '/') ? '/' : value + '/';
    }

    public getPathResult(path: string, name: string) {
        if (path.length > 0) {
            let arrayPath = path.split('/');
            let cleanArray = arrayPath.filter(x => x.length > 0);
            if (cleanArray[cleanArray.length - 1] == name) cleanArray.pop();
            return (cleanArray.length > 0) ? (cleanArray.join('/') + '/') : '/';
        } else return '/';
    }
    /**
     * GET PATH FOR ALL FILES
     * This function get a file path for all files. It's needed for dav request, since path is missing
     * @param value
     */
    public getAllFilesPath(value: any, folder: string) {
        if (folder.length > 0) {
            if (folder.charAt(0) != '/') folder = '/' + folder;
            if (folder.charAt(folder.length - 1) != '/') folder = folder + '/';
            return folder;
        } else return '/';
    }
    /**
     * GET LAST UPDATE REAL
     * This function get a timestamp and return a real date (dd/mm/yyyy)
     * @param value
     */
    public getLastUpdateReal(value: number) {
        if (value.toString().length < 13) {
            let need = 13 - value.toString().length;
            value = parseInt(value.toString() + '0'.repeat(need))
        }

        let string;
        string = new Date(value).toLocaleString();
        return string;
    }

    /**
     * GET TYPE
     * This function get the type of file (application, text, image, ...)
     * @param value
     */
    getType(value: string) {
        let index = value.indexOf('/');
        let subString = value.substring(0, index);
        return subString;
    }


    /**
     * GET EXTENSION
     * This function get the name of file without extension
     * Control on dot (need to find a better method)
     * If value is a folder return the value
     * @param value
     */
    getNameFile(value: string) {
        let objResponse = {
            name: '',
            realname: ''
        };
        let subString, realname;
        let decodeString = value;

        if (decodeString.indexOf('.') >= 0) {
            let index = decodeString.lastIndexOf('.');
            subString = decodeString.slice(0, index);
        } else {
            subString = decodeString;
        }

        if (subString.includes('[') && subString.indexOf('[') == 0)
            realname = subString.slice(subString.indexOf(']') + 1);
        else realname = subString;

        objResponse.name = realname;
        objResponse.realname = subString;

        return objResponse;
    }

    /** GET NAME FILE UPLOAD
     * Get ONLY name of a file uploaded
     * @param value (string) href of file
     *  **/
    getNameFileUpload(value: string) {
        let extension = '';
        let realExtension = '';
        let name = '';
        let cripted = false;

        let arraySlash = value.split('/');
        name = arraySlash[arraySlash.length - 1];
        if (name.indexOf('.') > 0) {
            let arrayDot = name.split('.');
            if(arrayDot.length>2){
                extension = '.' + arrayDot[arrayDot.length - 2];
                realExtension = '.' + arrayDot[arrayDot.length - 1];
                name = name.replace(extension, '');
                cripted = true;
            }else{
                extension = '.' + arrayDot[arrayDot.length - 1];
                name = name.replace(extension, '');
            }            
        }

        let subString = {
            name: name,
            extension: extension,
            cripted: cripted,
            realExtension: realExtension
        };

        return subString;
    }

    /** GET NAME FILE UPLOAD
     * Get ONLY name of a file uploaded
     * @param value (string) href of file
     *  **/
    getNameFolderUpload(value: string) {
        let subString;
        let array = value.split('/');
        subString = (array[array.length - 1].length == 0) ? array[array.length - 2] : array[array.length - 1];
        return subString;
    }


    /**
     * GET SHARE NAME FILE
     * This function get the name of file without extension
     * @param value is the file path
     */
    getShareNameFile(value: string) {
        if (value.includes('.')) { // CASE OF FILE
            const fullFileName = value.split('/').pop();
            const dotIndex = fullFileName.indexOf('.');
            const subString = decodeURIComponent(fullFileName).substring(0, dotIndex);
            return subString;

        } else { // CASE OF FOLDER
            if (value.includes('/')) {
                let subString = decodeURIComponent(value).substring(1, value.length);
                return subString;
            } else return value;
        }
    }

    /**
     * GET LABEL NAME FILE
     * This function get the name of file without extension or the name of folder
     * @param value is the file path
     */
    getLabelNameFile(value: string) {
        const last = value.split('/').pop();

        if (last.includes('.')) { // CASE OF FILE
            const dotIndex = last.indexOf('.');
            const subString = decodeURIComponent(last).substring(0, dotIndex);
            return subString;

        } else { // CASE OF FOLDER
            const subString = decodeURIComponent(last).substring(0, last.length);
            return subString;
        }
    }


    /**
     * GET EXTENSION
     * This function get the extension of file (jpg, txt, pdf, ...)
     * If value is a folder return empty
     * @param value
     */
    getExtension(value: string, check: boolean) {
        let subString;
        let decodeString = value;
        if (check) {
            let array = decodeString.split('.');
            for (let i = 0; i < array.length; i++) {
                if (i == 0) subString = decodeString.replace(array[i], '');
                else if (i != (array.length - 1)) subString = subString.replace(('.' + array[i]), '');
            }
        } else {
            subString = '';
        }

        return subString;
    }

    /**
     * GET EXTENSION PROTECTED
     *
     *  **/
    getExtensionProtected(value: string, check: boolean) {
        let subString;
        let decodeString = decodeURIComponent(value);
        if (decodeString.includes('.ven')) decodeString = decodeString.replace('.ven', '');

        if (check) {
            let array = decodeString.split('.');
            for (let i = 0; i < array.length; i++) {
                if (i == 0) subString = decodeString.replace(array[i], '');
                else if (i != (array.length - 1)) subString = subString.replace(('.' + array[i]), '');
            }
        } else {
            subString = 'folder';
        }

        return subString;
    }

    /**
     * GET IMAGE
     * This function get the type of the file and return
     * the associated image
     * @param value
     */
    public getImage(value: string, group, extension) {
        let img, imgclass;

        if (!Array.isArray(group) && !extension) {
            if (group == 'group') {
                img = 'folder_shared';
                imgclass = 'folder';
            } else if (group == 'external') {
                img = 'storage';
                imgclass = 'folder';
            } else {
                img = 'folder';
                imgclass = 'folder';
            }
        } else if (value == 'folder') {
            img = 'folder';
            imgclass = 'folder';
        } else if (this.allData.text.includes(extension)) {
            img = 'format_align_left';
            imgclass = 'text';
        } else if (this.allData.image.includes(extension)) {
            img = 'image';
            imgclass = 'image';
        } else if (this.allData.spredsheet.includes(extension)) {
            img = 'border_all';
            imgclass = 'xlxs';
        } else if (this.allData.video.includes(extension)) {
            img = 'movie_creation';
            imgclass = 'video';
        } else if (this.allData.powerpoint.includes(extension)) {
            img = 'desktop_windows';
            imgclass = 'pptx';
        } else if (this.allData.pdf.includes(extension)) {
            img = 'picture_as_pdf';
            imgclass = 'pdf';
        } else if (this.allData.audio.includes(extension)) {
            img = 'music_note';
            imgclass = 'audio';
        } else if (this.allData.richtext.includes(extension)) {
            img = 'short_text';
            imgclass = 'text';
        } else if (this.allData.compressed.includes(extension)) {
            img = 'zip';
            imgclass = 'zip';
        } else if (this.allData.svg.includes(extension)) {
            img = 'format_shapes';
            imgclass = 'svg';
        } else if (this.allData.p7m.includes(extension)) {
            img = 'gesture';
            imgclass = 'p7m';
        } else {
            img = 'insert_drive_file';
            imgclass = 'generic';
        }

        let result = {
            img: img,
            imgclass: imgclass,
        }

        return result;
    }

    /**
     * GET WEIGHT
     * This function get the byte value and return the value
     * changed in his multiple
     * @param value
     */
    public getWeight(value: number) {
        let wgt;
        if (value < 10) {
            wgt = '<1 Byte'
        } else {
            for (let i in this.objByte) {
                let counter = Math.trunc(value / this.objByte[i].value);
                if (counter > 0) {
                    wgt = counter + ' ' + this.dict.getDictionary(this.objByte[i].text);
                    break;
                }
            }
        }

        return wgt;
    }

    public getElementByFile(file: any, folder) {
        var element = new FileSharingData();
        let realfile = file.propstat[0].prop;
        let objName = this.getNameFileUpload(decodeURIComponent(file.href));
        let name = objName.name;
        let isFileBE = (realfile.getcontenttype) ? true : false;
        let typeBE = realfile.getcontenttype;
        let type = (isFileBE) ? this.getType(typeBE) : 'folder';
        let image = this.getImage(type, [], objName.extension);
        let date = new Date(realfile.getlastmodified).getTime();
        let path = this.getAllFilesPath(realfile, folder);
        let sharepermissions = Number(realfile.sharepermissions);

        element.id = realfile.fileid;
        element.name = name;
        element.realname = name;
        element.extension = objName.extension;
        element.realExtension = objName.realExtension;
        element.fileWeight = realfile.size;
        element.weight = this.getWeight(realfile.size);
        element.image = image.img;
        element.classimage = image.imgclass;
        element.lastUpdate = date;
        element.dateFunc = this.getLastUpdateFunc(date);
        element.file = true;
        element.preview = realfile.haspreview;
        element.dateReal = this.getLastUpdateReal(date);
        element.path = (path.charAt(0) == '/') ? path.substr(1) : path;
        element.permission = realfile.permissions;
        element.readonly = (realfile.sharepermissions == '1') ? true : false;
        element.reshare = (sharepermissions < 16 ) ? false : true;
        element.tag = (realfile.tags) ? realfile.tags : [];
        element.owner = realfile.ownerid;
        element.ownerName = realfile.ownerdisplayname;
        element.type = (!Array.isArray(realfile.mounttype) || realfile.mounttype != 'shared') ? realfile.mounttype : type;
        element.coded = objName.cripted;
        element.typecomplete = typeBE;

        return element;
    }

    public getFolderElement(file, upload, isGroup) {
        var element = new FileSharingData();
        let image;
        let sharepermissions = Number(file.sharepermissions);
        if (isGroup) image = this.getImage('folder', 'group', '');
        else image = this.getImage('folder', [], '');
        if (upload) {
            element.name = file.name;
            element.image = image.img;
            element.classimage = image.imgclass;
            element.dateFunc = this.getLastUpdateFunc(file.lastModified);
            element.extension = '';
            element.weight = this.getWeight(file.size);
            element.share = true;
            element.tag = [];
            element.readonly = (file.sharepermissions == '1') ? true : false;
            element.reshare = (sharepermissions < 16 ) ? false : true;
        } else {
            let arrayHref = file.href.split('/');
            let arrayFilter = arrayHref.filter(x => x.length > 0);
            let name, path = '';
            let arrayName = [...arrayFilter];
            if (arrayFilter.length > 5) {
                arrayFilter.pop();
                for (var a = 0; a < 4; a++) {
                    arrayFilter.shift();
                }
                path = decodeURIComponent(arrayFilter.join('/'));
                name = decodeURIComponent(arrayName[arrayName.length - 1]);
            } else {
                name = decodeURIComponent(arrayFilter[arrayFilter.length - 1]);
            }
            let realfile = file.propstat[0].prop;
            let date = new Date(realfile.getlastmodified).getTime();
            let sharepermissions = Number(file.sharepermissions);
            element.id = realfile.fileid;
            element.name = name;
            element.extension = '';
            element.fileWeight = realfile.size;
            element.weight = this.getWeight(realfile.size);
            element.image = image.img;
            element.classimage = image.imgclass;
            element.lastUpdate = date;
            element.dateFunc = this.getLastUpdateFunc(date);
            element.preview = realfile.haspreview;
            element.dateReal = this.getLastUpdateReal(date);
            element.path = path;
            element.permission = realfile.sharepermissions;
            element.tag = (realfile.tags) ? realfile.tags : [];
            element.owner = realfile.ownerid;
            element.ownerName = realfile.ownerdisplayname;
            element.readonly = (file.sharepermissions == '1') ? true : false;
            element.reshare = (sharepermissions < 16 ) ? false : true;
            element.owner = file.propstat[0].prop.ownerid ? file.propstat[0].prop.ownerid : '';
            element.ownerName = file.propstat[0].prop.ownerdisplayname ? file.propstat[0].prop.ownerdisplayname : '';
        }

        return element;
    }

    public getFolderElementCopy(name, path) {
        var element = new FileSharingData();
        let image = this.getImage('folder', [], '');
        element.name = name;
        element.image = image.img;
        element.classimage = image.imgclass;
        element.dateFunc = this.getLastUpdateFunc(new Date().getTime());
        element.extension = '';
        element.weight = '<1 Byte';
        element.share = false;
        element.path = path;
        element.tag = [];
        element.hide = false;
        element.reshare = true;

        return element;
    }

    public getFolderElementAllfiles(file, upload, folder) {
        var element = new FileSharingData();
        let image = this.getImage('folder', [], '');
        let realfile = (upload)? file : file.propstat[0].prop;
        let date = (upload)? new Date().getTime() : new Date(realfile.getlastmodified).getTime();
        if (upload) {
            element.name = file.name;
            element.share = false;
            element.path = folder;
            element.tag = [];            
        } else {
            let name = this.getNameFolderUpload(decodeURIComponent(file.href));
            let path = decodeURIComponent(file.href).split('/').slice(5).filter(item => item !== name);

            element.id = realfile.fileid;
            element.name = name;            
            element.fileWeight = realfile.size;                        
            element.lastUpdate = date;
            element.preview = realfile.haspreview;
            element.dateReal = this.getLastUpdateReal(date);
            element.path = decodeURIComponent(path.join('/'));
            element.permission = realfile.permissions;
            element.tag = (realfile.tags) ? realfile.tags : [];
        }

        element.owner = realfile.ownerid ? realfile.ownerid : '';
        element.ownerName = realfile.ownerdisplayname ? realfile.ownerdisplayname : '';
        element.weight = this.getWeight(realfile.size);
        element.dateFunc = this.getLastUpdateFunc(date);
        element.image = image.img;
        element.classimage = image.imgclass;
        element.extension = '';

        return element;
    }

    public getFileElement(file, upload) {
        var element = new FileSharingData();
        let image = this.getImage('text', [], '.txt');
        let name = this.getNameFile(file.name);

        element.name = name.name;
        element.image = image.img;
        element.classimage = image.imgclass;
        element.dateFunc = (upload)? this.getLastUpdateFunc(file.lastModified) : this.getLastUpdateFunc(Date.now());
        element.weight = (upload)? this.getWeight(file.size) : this.getWeight(0);
        element.extension = '.txt';
        element.share = true;
        element.file = true;

        return element;
    }

    /** GET FILE ELEMENT TXT
     * Used in creating new note file
     * @param file (any) file content
     * @param id (string)
     * @param path (string)
     * @param upload (boolean)
     **/

    public getFileElementTxt(file, id, path: string, upload, elementFile?) {
        var element = new FileSharingData();
        let image = this.getImage('text', [], '.txt');

        element.name = (upload) ? this.getNameFile(file.name).name : this.getNameFile(file).name;
        element.image = image.img;
        element.classimage = image.imgclass;
        element.dateFunc = (upload) ? this.getLastUpdateFunc(file.lastModified) : this.getLastUpdateFunc(Date.now());
        element.extension = '.txt';
        element.weight = (upload) ? this.getWeight(file.size) : this.getWeight(0);
        element.share = true;
        element.file = true;
        element.id = id;
        element.path = decodeURIComponent(path);
        element.tag = [];
        element.ownerName = elementFile.ownerdisplayname ? elementFile.ownerdisplayname : '';
        element.owner = elementFile.ownerid ? elementFile.ownerid : '';

        return element;
    }

    /** GET FILE ELEMENT OO (only office)
     * Create temporary element for table view
     * @param name (string)
     * @param extension (string)
     * @param path (string)
     * @param result (any)
     */
    public getFileElementOO(name: string, extension: string, path: string, result: any) {
        var element = new FileSharingData();
        let date = new Date(result.getlastmodified).getTime();
        let image = this.getImage('text', [], extension);
        let sharepermissions = Number(result.sharepermissions);
        element.name = name;
        element.image = image.img;
        element.classimage = image.imgclass;
        element.extension = extension;
        element.file = true;
        element.path = decodeURIComponent(path);
        element.id = result.fileid;
        element.fileWeight = result.size;
        element.lastUpdate = date;
        element.dateFunc = this.getLastUpdateFunc(date);
        element.dateReal = this.getLastUpdateReal(date);
        element.weight = this.getWeight(result.size);
        element.tag = [];
        element.permission = result.permissions;
        element.readonly = (result.sharepermissions == '1') ? true : false;
        element.reshare = (sharepermissions < 16 ) ? false : true;
        element.ownerName = result.ownerdisplayname ? result.ownerdisplayname : '';
        element.owner = result.ownerid  ? result.ownerid : '';
        return element;
    }

    /**
     * GET RESPONSE DELETED FILES
     * Elaborate response service list all files
     * @param array
     */
    public getResponseDeletedFiles(array) {
        let dataValue = [];
        let ko = '404';
        array = array.slice(1);

        for (let a in array) {
            let objValue = {} as FileDeletedData;
            for (let b in array[a].propstat) {
                let child = array[a].propstat[b].prop;
                if (!array[a].propstat[b].status.includes(ko) && ('trashbindeletiontime' in child)) {
                    let timestamp = new Date(child.getlastmodified).getTime();
                    this.type = (child.getcontenttype) ? this.getType(child.getcontenttype) : 'folder';
                    let isfile = (child.getcontenttype) ? true : false;
                    let extension = this.getExtension(child.trashbinfilename, isfile);
                    let image = this.getImage(this.type, child.mounttype, extension);
                    this.image = image.img;
                    let name = (child.getcontenttype) ? this.getNameFile(child.trashbinfilename) : child.trashbinfilename;


                    objValue.id = child.fileid;
                    objValue.deletedTimestamp = child.trashbindeletiontime;
                    objValue.fileWeight = child.size;
                    objValue.tag = child.getetag;
                    objValue.permissions = child.permissions;
                    objValue.name = (child.getcontenttype) ? name.name : name;
                    objValue.realname = (child.getcontenttype) ? name.realname : name;
                    objValue.extension = extension;
                    objValue.originalPath = child.trashbinoriginallocation;
                    objValue.weight = this.getWeight(child.size);
                    objValue.lastUpdate = this.getLastUpdateReal(timestamp);
                    objValue.deletedTime = this.getLastUpdateReal(child.trashbindeletiontime);
                    objValue.timepassed = this.getLastUpdateFunc(child.trashbindeletiontime);
                    objValue.type = (!Array.isArray(child.mounttype) || child.mounttype != 'shared') ? child.mounttype : this.type;;
                    objValue.image = image.img;
                    objValue.classimage = image.imgclass;
                    objValue.file = (child.getcontenttype) ? true : false;
                    objValue.hasPreview = (child.haspreview || child.haspreview.length > 0) ? true : false;
                    objValue.isRow = false;

                    dataValue.push(objValue);
                }
            }
        }
        return dataValue;
    }


    /**
     * GET RESPONSE FAVORITES
     * Elaborate response service list all files
     * @param array
     */
    public getResponseFavorites(array) {
        let dataValue = [];
        let homeOwner, ko = '404';
        let home = this.getPathFavorites(array);

        for (let a in array) {
            let objValue = new FileSharingData();
            for (let b in array[a].propstat) {
                let child = array[a].propstat[b].prop;
                if (!array[a].propstat[b].status.includes(ko)) {
                    let dateBE = new Date(child.getlastmodified).getTime();
                    let typeBE = child.getcontenttype;
                    let isFileBE = (typeBE) ? true : false;
                    let bytesBE = child.size;
                    let nameBE = decodeURIComponent(array[a].href.replace(home, ''));
                    let path = this.newPathFile(nameBE);
                    let extension = this.getExtension(nameBE, isFileBE);
                    let getname = this.newGetNameFile(nameBE, path, extension);

                    this.type = (isFileBE) ? this.getType(typeBE) : 'folder';                    
                    let image = this.getImage(this.type, child.mounttype, extension);
                    this.dateFunc = this.getLastUpdateFunc(dateBE);
                    this.dateReal = this.getLastUpdateReal(dateBE);
                    this.weight = this.getWeight(bytesBE);
                    let sharepermissions = Number(child.sharepermissions);
                    let realExtension;
                    if (extension == '.ven' || extension == '.ved') {
                        isFileBE = (extension == '.ven') ? true : false;
                        realExtension = (isFileBE) ? this.getExtensionProtected(nameBE, isFileBE) : '';
                        let type;
                        type = (isFileBE) ? this.getType(realExtension) : 'folder';
                        image = this.getImage(type, [], realExtension);
                    }

                    objValue.id = child.fileid;
                    objValue.name = getname.name;
                    objValue.realname = getname.realname;
                    objValue.extension = extension;
                    objValue.realExtension = (realExtension) ? realExtension : '';
                    objValue.fileWeight = bytesBE;
                    objValue.lastUpdate = dateBE;
                    objValue.tag = child.getetag;
                    objValue.owner = child.ownerid;
                    objValue.ownerName = child.ownerdisplayname;
                    objValue.ownerHome = child.homeOwner;
                    objValue.permission = child.sharepermissions;
                    objValue.file = (isFileBE) ? true : false;
                    objValue.favorite = (child.favorite == 1) ? true : false;
                    objValue.share = (homeOwner != child.ownerid) ? true : false;
                    objValue.preview = (child.haspreview == 'true') ? true : false;
                    objValue.coded = (extension == '.ven' || extension == '.ved') ? true : false;
                    objValue.reshare = (sharepermissions < 16 ) ? false : true;

                    objValue.typecomplete = typeBE;
                    objValue.type = (!Array.isArray(child.mounttype) || child.mounttype != 'shared') ? child.mounttype : this.type;
                    objValue.image = image.img;
                    objValue.classimage = image.imgclass;
                    objValue.dateFunc = this.getLastUpdateFunc(dateBE);
                    objValue.dateReal = this.getLastUpdateReal(dateBE);
                    objValue.weight = this.getWeight(bytesBE);
                    objValue.path = '/' + path;
                    if (child.sharetypes.length === 0) {
                        objValue.shareTypes = [];
                    } else if (child.sharetypes.sharetype !== undefined && child.sharetypes.sharetype.length > 0) {
                        objValue.shareTypes = child.sharetypes.sharetype;
                    } else {
                        objValue.shareTypes = [child.sharetypes.sharetype];
                    }

                    dataValue.push(objValue);
                }
            }
        }
        return dataValue;
    }

    /** NEW PATH FILE
     * Rework function 2022
     * @Input path (string) with name
     * @Output result (string) without file/folder name 
     **/
    newPathFile(path: string){
        let result = '';
        let arrayPath = path.split('/');
        if(arrayPath.length>1){
            arrayPath.pop();
            result = arrayPath.join('/') + '/';
        }
        return result;
    }

    /** NEW GET NAME FILE
     * Rework function 2022
     * @Input url (string) complete BE name
     * @Input path (string)
     * @Input ext (string)
     * @Output objResponse (obj) name of the file/folder 
     **/
    newGetNameFile(url: string, path: string, ext: string){
        let objResponse = {
            name: '',
            realname: ''
        };

        let subString, realname;
        
        subString = url.replace((path), '');
        subString = subString.replace(ext, '');

        if (subString.includes('[') && subString.indexOf('[') == 0)
            realname = subString.slice(subString.indexOf(']') + 1);
        else realname = subString;

        objResponse.name = realname;
        objResponse.realname = subString;

        return objResponse;
    }

    getPathFavorites(array){
        let path;
        for(var i in array){
            let arrayUrl = array[i].href.split('/').filter(Boolean);
            let index = (arrayUrl.indexOf(sessionStorage.user));
            let pathName = arrayUrl.splice(0,index+1);
            path = pathName.join('/');
            path = '/' + path + '/';
            if(path) break;
        }
        return path;
    }


    /** GET PATH FROM HREF
     * Used to get base path/name user from href
     * @param array the response BE from "any" List Services
     **/
    getPathFromHREF(array) {
        let first;
        if (Array.isArray(array)) {
            for (let i in array) {
                if (!first) {
                    first = array[i].href.split('/');
                } else {
                    let second = array[i].href.split('/');
                    let longer = (second.length > first.length) ? second.length : first.length;
                    for (let a = 0; a <= longer; a++) {
                        if (first[a] != second[a]) {
                            first = first.slice(0, a);
                            break;
                        }
                    }
                }
            }
        } else {
            if (array.href.includes(window.sessionStorage.user)) {
                let index = array.href.indexOf(window.sessionStorage.user) + window.sessionStorage.user.length + 1;
                first = array.href.substring(0, index);
            }
        }

        let result = (Array.isArray(first)) ? (first.join('/') + '/') : first;
        return result;
    }

    /** GET RESULT ACTIVITY SIDE
     * Get parameters activity sidebar from service (activity/filter)
     * @param array array
     **/
    getResultActivitySide(array) {
        let arrayData = [];
        for (var i in array) {
            let timestamp = Date.parse(array[i].datetime);
            let objValue = {} as ActivityData;
            let passedtime = this.getLastUpdateFunc(timestamp);

            objValue.id = array[i].object_id;
            objValue.name = array[i].object_name;
            objValue.type = array[i].type;
            objValue.icon = this.getIconActivity(array[i].type);
            objValue.info = array[i].subject;
            objValue.timestamp = timestamp;
            objValue.humandate = this.getLastUpdateReal(timestamp);
            objValue.passedtime = passedtime;
            objValue.allInfo = array[i].subject + ', ' + passedtime;
            objValue.dictType = this.dict.getDictionary(array[i].type);
            //objValue.dictInfo = ;

            arrayData.push(objValue);
        }
        return arrayData;
    }

    /** GET ICON ACTIVITY
     * Get icon for activity sidebar response (GET RESULT ACTIVITY SIDE)
     * WORK IN PROGRESS: need to add other actions
     * @param type string
     **/
    getIconActivity(type) {
        if (type == 'file_created') return 'add';
        else if (type.includes('favorite')) return 'favorite';
        else if (type == 'shared' || type == 'file_downloaded') return 'share';
        else if (type == 'systemtags') return 'label';
        else if (type == 'file_changed') return 'create';
    }

    /** GET LABELS LIST **/
    getLabelsList(array) {
        let arrayData = [];
        if (Array.isArray(array)) {
            array.shift();

            for (var i in array) {
                let element = array[i].propstat.prop;
                let objValue = {} as LabelsList;

                objValue.id = element.id;
                objValue.name = element.displayname;
                objValue.canuse = element.canassign;
                objValue.assignable = element.userassignable;

                arrayData.push(objValue);
            }
        }

        return arrayData;
    }

    /**
     * GET RESPONSE ALL FILES ONLY FOLDER
     * Elaborate response service list all files
     * @param array
     */
    public getResponseAllFolder(array, folder, nameother) {
        var completePath = this.getPathFromHREF(array);
        var folder = (!!folder) ? folder : '';
        let dataValue = [];
        let home, ko = '404';

        for (let a in array) {
            let objValue = new FileSharingData();
            let path: string = array[a].href;
            if (!path.includes('ATTACHMENTS_FOLDER_NAME') && !path.includes('Allegati%20vPEC') && !path.includes('Attachments%20Folder') && !path.includes('vMeet_49ADB14325D3B5')) {
                for (let b in array[a].propstat) {
                    let child = array[a].propstat[b].prop;
                    if (!array[a].propstat[b].status.includes(ko)) {
                        if (!home) {
                            home = path.replace(' ', '%20');
                        } else {
                            if (!child.getcontenttype && child.mounttype != 'group' && child.mounttype != 'shared') {
                                let indexName = completePath.indexOf(child.ownerdisplayname) + child.ownerdisplayname.length;
                                let realpath = completePath.slice(indexName);
                                let dateBE = new Date(child.getlastmodified).getTime();
                                let tagBE = child.getetag;
                                let typeBE = child.getcontenttype;
                                let isFileBE = (child.getcontenttype) ? true : false;
                                let bytesBE = child.size;
                                let href = array[a].href.replace(home, '');
                                let nameBE = (isFileBE) ? decodeURIComponent(href) : decodeURIComponent(href).slice(0, -1);
    
                                if (!Array.isArray(nameother)) {
                                    if (!nameother || nameother != nameBE) {
                                        this.getInnerAllFolder(objValue, child, dataValue, isFileBE, typeBE, dateBE, nameBE, array[a], bytesBE, folder, tagBE, realpath);
                                    }
                                } else {
                                    let control = true;
                                    for (var c in nameother) {
                                        if (nameother[c].name == nameBE) {
                                            control = false;
                                            break;
                                        }
                                    }
    
                                    if (control) {
                                        this.getInnerAllFolder(objValue, child, dataValue, isFileBE, typeBE, dateBE, nameBE, array[a], bytesBE, folder, tagBE, realpath);
                                    }
                                }
    
                            }
                        }
                    }
                }
            }
        }
        return dataValue;
    }

    /** GET INNER ALL FOLDER
     * Used inside getResponseAllFolder() for !duplicate code
     **/
    getInnerAllFolder(objValue, child, dataValue, isFileBE, typeBE, dateBE, nameBE, array, bytesBE, folder, tagBE, realpath) {
        this.type = (isFileBE) ? this.getType(typeBE) : 'folder';
        let extension = this.getExtension(nameBE, isFileBE)
        let image = this.getImage(this.type, child.mounttype, extension);

        objValue.id = child.fileid;
        objValue.name = (isFileBE) ? this.getNameFile(nameBE) : nameBE;
        objValue.extension = extension;
        objValue.fileWeight = bytesBE;
        objValue.lastUpdate = dateBE;
        objValue.tag = tagBE;
        objValue.owner = child.ownerid;
        objValue.ownerName = child.ownerdisplayname;
        objValue.ownerHome = child.homeOwner;
        objValue.permission = child.permissions;

        objValue.file = (isFileBE) ? true : false;
        objValue.event = false;
        objValue.isRow = false;
        objValue.coded = false;

        objValue.favorite = (child.favorite == 1) ? true : false;
        objValue.hide = false;
        objValue.rename = false;
        objValue.share = (child.homeOwner != child.ownerid) ? true : false;
        objValue.preview = (child.haspreview == 'true') ? true : false;

        objValue.type = (!Array.isArray(child.mounttype) || child.mounttype != 'shared') ? child.mounttype : this.type;;
        objValue.image = image.img;
        objValue.classimage = image.imgclass;
        objValue.dateFunc = this.getLastUpdateFunc(dateBE);
        objValue.dateReal = this.getLastUpdateReal(dateBE);
        objValue.weight = this.getWeight(bytesBE);
        objValue.path = this.getAllFilesPath(array, folder);
        objValue.completepath = realpath;

        if (child.sharetypes.length === 0) {
            objValue.shareTypes = [];
        } else if (child.sharetypes.sharetype !== undefined && child.sharetypes.sharetype.length > 0) {
            objValue.shareTypes = child.sharetypes.sharetype;
        } else {
            objValue.shareTypes = [child.sharetypes.sharetype];
        }

        dataValue.push(objValue);
    }

    /** GET RESULT VERSIONS SIDE **/
    getResultVersionsSide(array: any) {
        let dataValue = [];
        for (var i in array) {
            let objValue = {} as VersionsData;
            if (!array[i].propstat.status.includes('404')) {
                let element = array[i].propstat.prop;
                let timestamp = new Date(element.getlastmodified).getTime();
                let href = array[i].href.substring(array[i].href.indexOf('versions'));

                objValue.timestamp = timestamp;
                objValue.date = this.getLastUpdateFunc(timestamp);
                objValue.weight = this.getWeight(element.getcontentlength);
                objValue.href = href;
                objValue.completehref = array[i].href;

                dataValue.push(objValue);
            }
        }
        return dataValue;
    }

    getResponseSearchResult(array) {
        const dataValue = [];

        for (const item of array) {
            const objValue = new FileSharingData();
            let isfile = (item.type === 'file') ? true : false;
            this.type = (isfile || item.type === 'image') ? this.getType(item.mime_type) : 'folder';
            let extension = this.getExtension(item.name, isfile)
            let image = this.getImage(this.type, [], extension);

            // Populate obj
            objValue.id = parseInt(item.id);
            objValue.name = (isfile) ? this.getNameFile(item.name).name : item.name;
            objValue.extension = extension;
            objValue.fileWeight = item.size;
            objValue.lastUpdate = item.modified;
            objValue.permission = item.permissions;
            objValue.file = (isfile) ? true : false;
            objValue.typecomplete = item.mime_type;
            objValue.type = this.type;
            objValue.image = image.img;
            objValue.classimage = image.imgclass;
            objValue.dateFunc = this.getLastUpdateFunc(item.modified);
            objValue.dateReal = this.getLastUpdateReal(item.modified);
            objValue.weight = this.getWeight(item.size);
            objValue.path = this.getPathResult(item.path, item.name);

            dataValue.push(objValue);
        }
        return dataValue;
    }

    /** GET RESPONSE GROUP FOLDERS
     * @param array array response of services 'files?'
     * @param folder boolean
     * Return elaborated response
     * Used on group folder list
     **/
    getResponseGroupFolders(array, folder) {
        var completePath = this.getPathFromHREF(array);
        var folder = (!!folder) ? folder : '';
        let dataValue = [];
        let home, ko = '404';

        for (let a in array) {
            let objValue = new FileSharingData();
            let path = array[a].href;
            for (let b in array[a].propstat) {
                let child = array[a].propstat[b].prop;
                if (!array[a].propstat[b].status.includes(ko)) {
                    if (!home) {
                        home = path.replace(' ', '%20');
                    } else {
                        if (child.mounttype == 'group') {
                            let indexName = completePath.indexOf(child.ownerdisplayname) + child.ownerdisplayname.length;
                            let realpath = completePath.slice(indexName);
                            let dateBE = new Date(child.getlastmodified).getTime();
                            let tagBE = child.getetag;
                            let typeBE = child.getcontenttype;
                            let isFileBE = (child.getcontenttype) ? true : false;
                            let bytesBE = child.size;
                            let href = array[a].href.replace(home, '');
                            let nameBE = (isFileBE) ? decodeURIComponent(href) : decodeURIComponent(href).slice(0, -1);
                            this.type = (isFileBE) ? this.getType(typeBE) : 'folder';
                            let extension = this.getExtension(nameBE, isFileBE)
                            let image = this.getImage(this.type, child.mounttype, extension);
                            this.image = image.img;
                            let name, realname;
                            if (isFileBE) {
                                let getname = this.getNameFile(nameBE);
                                name = getname.name;
                                realname = getname.realname;
                            } else {
                                name = decodeURIComponent(nameBE);
                                realname = decodeURIComponent(nameBE);
                            }

                            objValue.id = child.fileid;
                            objValue.name = name;
                            objValue.realname = realname;
                            objValue.extension = extension;
                            objValue.fileWeight = bytesBE;
                            objValue.lastUpdate = dateBE;
                            objValue.tag = tagBE;
                            objValue.owner = child.ownerid;
                            objValue.ownerName = child.ownerdisplayname;
                            objValue.ownerHome = child.homeOwner;
                            objValue.permission = child.permissions;

                            objValue.file = (isFileBE) ? true : false;
                            objValue.favorite = (child.favorite == 1) ? true : false;
                            objValue.share = (child.homeOwner != child.ownerid) ? true : false;
                            objValue.preview = (child.haspreview == 'true') ? true : false;

                            objValue.typecomplete = child.getcontenttype;
                            objValue.type = (!Array.isArray(child.mounttype) || child.mounttype != 'shared') ? child.mounttype : this.type;;
                            objValue.image = image.img;
                            objValue.classimage = image.imgclass;
                            objValue.dateFunc = this.getLastUpdateFunc(dateBE);
                            objValue.dateReal = this.getLastUpdateReal(dateBE);
                            objValue.weight = this.getWeight(bytesBE);
                            objValue.path = this.getAllFilesPath(array[a], folder);
                            objValue.completepath = realpath;

                            if (child.sharetypes.length === 0) {
                                objValue.shareTypes = [];
                            } else if (child.sharetypes.sharetype !== undefined && child.sharetypes.sharetype.length > 0) {
                                objValue.shareTypes = child.sharetypes.sharetype;
                            } else {
                                objValue.shareTypes = [child.sharetypes.sharetype];
                            }
                            if (child.ownerid) {
                                objValue.profile_pic_url = `${globals.endpoint}/setting/info/avatar/getavatar?user=` + child.ownerid + `&size=30`;
                            }

                            dataValue.push(objValue);
                        }
                    }
                }
            }
        }
        return dataValue;
    }

    /** GET RESPONSE EXTERNAL ARCHIVES
     * @param array array response of services 'mounts?'
     * Return elaborated response
     * Used on external archives list
     **/
    getResponseExternalArchives(array) {
        let dataValue = [];
        for (let i in array) {
            let objValue = {} as ArchivesData;

            objValue.backend = array[i].backend;
            objValue.class = array[i].class;
            objValue.id = array[i].id;
            objValue.name = array[i].name;
            objValue.path = array[i].path.substring(1);
            objValue.permissions = array[i].permissions;
            objValue.scope = array[i].scope;
            objValue.type = array[i].type;
            objValue.image = 'storage';
            objValue.classimage = 'folder';

            dataValue.push(objValue);
        }
        return dataValue;
    }

    getResponseGroupsFolder(array, username, folder) {
        var username = (!!username) ? username : '';
        var folder = (!!folder) ? folder : '';
        let dataValue = [];
        let home, homeOwner, ko = '404';
        let permissions;

        for (let a in array) {
            let objValue = new FileSharingData();
            let path = array[a].href;
            for (let b in array[a].propstat) {
                let child = array[a].propstat[b].prop;
                if (!array[a].propstat[b].status.includes(ko)) {
                    if (!home) {
                        home = path.replace(' ', '%20');
                        homeOwner = username;
                        permissions = this.getPermissions(child.permissions, false);
                    } else if (parseInt(child.fileid) > 0 && child.mounttype == 'group') {
                        let dateBE = new Date(child.getlastmodified).getTime();
                        let tagBE = child.getetag;
                        let typeBE = child.getcontenttype;
                        let isFileBE = (child.getcontenttype) ? true : false;
                        let bytesBE = child.size;
                        let href = array[a].href.replace(home, '');
                        let nameBE = (isFileBE) ? decodeURIComponent(href) : decodeURIComponent(href).slice(0, -1);

                        let name, realname;
                        if (isFileBE) {
                            let getname = this.getNameFile(nameBE);
                            name = getname.name;
                            realname = getname.realname;
                        } else {
                            name = decodeURIComponent(nameBE);
                            realname = decodeURIComponent(nameBE);
                        }

                        let extension = this.getExtension(nameBE, isFileBE);
                        this.type = (isFileBE) ? this.getType(typeBE) : 'folder';
                        let image;

                        if (Array.isArray(child.tags) || extension) {
                            image = this.getImage(this.type, child.mounttype, extension);
                        } else {
                            image = {
                                img: (typeof child.tags.tag == 'string') ? 'gesture' : 'attachment',
                                imgclass: 'folder',
                            }
                        }

                        this.image = image.img;
                        this.dateFunc = this.getLastUpdateFunc(dateBE);
                        this.dateReal = this.getLastUpdateReal(dateBE);
                        this.weight = this.getWeight(bytesBE);
                        this.path = this.getAllFilesPath(array[a], folder);

                        let tags = false;
                        for (var k in child.tags.tag) {
                            if ((child.tags.tag[k].includes('vPecAttachmentsFolder') && child.tags.tag[k].includes('true'))
                                || child.tags.tag[k].includes('mailDateTime'))
                                tags = true;
                        }

                        objValue.id = child.fileid;
                        objValue.name = name;
                        objValue.realname = realname;
                        objValue.extension = extension;
                        objValue.fileWeight = bytesBE;
                        objValue.lastUpdate = dateBE;
                        objValue.tag = tagBE;
                        objValue.owner = child.ownerid;
                        objValue.ownerName = child.ownerdisplayname;
                        objValue.ownerHome = child.homeOwner;
                        objValue.permission = child.permissions;
                        objValue.crypted = (Array.isArray(child.tags)) ? false : true;
                        objValue.file = (isFileBE) ? true : false;
                        objValue.favorite = (child.favorite == 1) ? true : false;
                        objValue.share = (homeOwner != child.ownerid) ? true : false;
                        objValue.preview = (child.haspreview == 'true') ? true : false;

                        objValue.typecomplete = child.getcontenttype;
                        objValue.type = (!Array.isArray(child.mounttype) || child.mounttype != 'shared') ? child.mounttype : this.type;
                        objValue.image = image.img;
                        objValue.classimage = image.imgclass;
                        objValue.dateFunc = this.getLastUpdateFunc(dateBE);
                        objValue.dateReal = this.getLastUpdateReal(dateBE);
                        objValue.weight = this.getWeight(bytesBE);
                        objValue.path = (this.path.charAt(0) == '/') ? this.path.substr(1) : this.path;
                        if (child.sharetypes.length === 0) {
                            objValue.shareTypes = [];
                        } else if (child.sharetypes.sharetype !== undefined && child.sharetypes.sharetype.length > 0) {
                            objValue.shareTypes = child.sharetypes.sharetype;
                        } else {
                            objValue.shareTypes = [child.sharetypes.sharetype];
                        }
                        if (child.ownerid) {
                            objValue.profile_pic_url = `${globals.endpoint}/setting/info/avatar/getavatar?user=` + child.ownerid + `&size=30`;
                        }
                        objValue.isAttachment = tags;

                        dataValue.push(objValue);
                    }
                }
            }
        }
        return { data: dataValue, permissions: permissions };
    }

    getResponseExternalArchivesFolder(array, username, folder) {
        var username = (!!username) ? username : '';
        var folder = (!!folder) ? folder : '';
        let dataValue = [];
        let home, homeOwner, ko = '404';

        for (let a in array) {
            let objValue = new FileSharingData();
            let path = array[a].href;
            for (let b in array[a].propstat) {
                let child = array[a].propstat[b].prop;
                if (!array[a].propstat[b].status.includes(ko)) {
                    if (!home) {
                        home = path.replace(' ', '%20');
                        homeOwner = username;
                    } else if (parseInt(child.fileid) > 0) {
                        let dateBE = new Date(child.getlastmodified).getTime();
                        let tagBE = child.getetag;
                        let typeBE = child.getcontenttype;
                        let isFileBE = (child.getcontenttype) ? true : false;
                        let bytesBE = child.size;
                        let href = array[a].href.replace(home, '');
                        let nameBE = (isFileBE) ? decodeURIComponent(href) : decodeURIComponent(href).slice(0, -1);

                        let name, realname;
                        if (isFileBE) {
                            let getname = this.getNameFile(nameBE);
                            name = getname.name;
                            realname = getname.realname;
                        } else {
                            name = decodeURIComponent(nameBE);
                            realname = decodeURIComponent(nameBE);
                        }

                        let extension = this.getExtension(nameBE, isFileBE);
                        this.type = (isFileBE) ? this.getType(typeBE) : 'folder';
                        let image;

                        if (Array.isArray(child.tags) || extension) {
                            image = this.getImageStorage(this.type, child.mounttype, extension);
                        } else {
                            image = {
                                img: (typeof child.tags.tag == 'string') ? 'gesture' : 'attachment',
                                imgclass: 'folder',
                            }
                        }

                        this.image = image.img;
                        this.dateFunc = this.getLastUpdateFunc(dateBE);
                        this.dateReal = this.getLastUpdateReal(dateBE);
                        this.weight = this.getWeight(bytesBE);
                        this.path = this.getAllFilesPath(array[a], folder);

                        let tags = false;
                        for (var k in child.tags.tag) {
                            if ((child.tags.tag[k].includes('vPecAttachmentsFolder') && child.tags.tag[k].includes('true'))
                                || child.tags.tag[k].includes('mailDateTime'))
                                tags = true;
                        }

                        objValue.id = child.fileid;
                        objValue.name = name;
                        objValue.realname = realname;
                        objValue.extension = extension;
                        objValue.fileWeight = bytesBE;
                        objValue.lastUpdate = dateBE;
                        objValue.tag = tagBE;
                        objValue.owner = child.ownerid;
                        objValue.ownerName = child.ownerdisplayname;
                        objValue.ownerHome = child.homeOwner;
                        objValue.permission = child.permissions;
                        objValue.crypted = (Array.isArray(child.tags)) ? false : true;
                        objValue.file = (isFileBE) ? true : false;
                        objValue.favorite = (child.favorite == 1) ? true : false;
                        objValue.share = (homeOwner != child.ownerid) ? true : false;
                        objValue.preview = (child.haspreview == 'true') ? true : false;

                        objValue.typecomplete = child.getcontenttype;
                        objValue.type = (!Array.isArray(child.mounttype) || child.mounttype != 'shared') ? child.mounttype : this.type;
                        objValue.image = image.img;
                        objValue.classimage = image.imgclass;
                        objValue.dateFunc = this.getLastUpdateFunc(dateBE);
                        objValue.dateReal = this.getLastUpdateReal(dateBE);
                        objValue.weight = this.getWeight(bytesBE);
                        objValue.path = (this.path.charAt(0) == '/') ? this.path.substr(1) : this.path;
                        if (child.sharetypes.length === 0) {
                            objValue.shareTypes = [];
                        } else if (child.sharetypes.sharetype !== undefined && child.sharetypes.sharetype.length > 0) {
                            objValue.shareTypes = child.sharetypes.sharetype;
                        } else {
                            objValue.shareTypes = [child.sharetypes.sharetype];
                        }
                        if (child.ownerid) {
                            objValue.profile_pic_url = `${globals.endpoint}/setting/info/avatar/getavatar?user=` + child.ownerid + `&size=30`;
                        }
                        objValue.isAttachment = tags;

                        dataValue.push(objValue);
                    }
                }
            }
        }
        return dataValue;
    }

    getImageStorage(value: string, group, extension) {
        let img, imgclass;

        if (!Array.isArray(group) && !extension) {
            if (group == 'group') {
                img = 'folder_shared';
                imgclass = 'folder';
            } else {
                img = 'folder';
                imgclass = 'folder';
            }
        } else if (value == 'folder') {
            img = 'folder';
            imgclass = 'folder';
        } else if (this.allData.text.includes(extension)) {
            img = 'format_align_left';
            imgclass = 'text';
        } else if (this.allData.image.includes(extension)) {
            img = 'image';
            imgclass = 'image';
        } else if (this.allData.spredsheet.includes(extension)) {
            img = 'border_all';
            imgclass = 'xlxs';
        } else if (this.allData.video.includes(extension)) {
            img = 'movie_creation';
            imgclass = 'video';
        } else if (this.allData.powerpoint.includes(extension)) {
            img = 'desktop_windows';
            imgclass = 'pptx';
        } else if (this.allData.pdf.includes(extension)) {
            img = 'picture_as_pdf';
            imgclass = 'pdf';
        } else if (this.allData.audio.includes(extension)) {
            img = 'music_note';
            imgclass = 'audio';
        } else if (this.allData.richtext.includes(extension)) {
            img = 'short_text';
            imgclass = 'text';
        } else if (this.allData.compressed.includes(extension)) {
            img = 'zip';
            imgclass = 'zip';
        } else if (this.allData.svg.includes(extension)) {
            img = 'format_shapes';
            imgclass = 'svg';
        } else {
            img = 'insert_drive_file';
            imgclass = 'generic';
        }

        let result = {
            img: img,
            imgclass: imgclass,
        }

        return result;
    }

    /** GET RESPONSE VPEC
     * @param array array response of services 'mail/getattachmentsfolderid?'
     * Return elaborated response
     * Used on vpec list
     * **/
    getResponseVpec(array, id) {
        let dataValue = [], homepath;
        for (var i = 0; i < array.length; i++) {
            let href = array[i].href;
            let element = array[i].propstat[0].prop;
            if ((id && element.fileid != id) || i != 0) {
                let objValue = {} as vpecData;
                let timestamp = new Date(element.getlastmodified).getTime();
                let isFile = (element.getcontenttype) ? true : false;
                let completeName = this.getNameExtensionVPEC(href, isFile);
                if (isFile) {
                    var type = (isFile) ? this.getType(element.getcontenttype) : 'folder';
                    var image = this.getImage(type, element.mounttype, completeName.extension);
                }

                let tags = false;
                for (var k in element.tags.tag) {
                    if ((element.tags.tag[k].includes('vPecAttachmentsFolder') && element.tags.tag[k].includes('true'))
                        || element.tags.tag[k].includes('mailDateTime'))
                        tags = true;
                }

                objValue.name = completeName.name;
                objValue.extension = completeName.extension;
                objValue.realname = completeName.realname;
                objValue.id = element.fileid;
                objValue.isfile = isFile;
                objValue.image = (isFile) ? image.img : 'mail';
                objValue.classimage = (isFile) ? image.imgclass : 'folder';
                objValue.size = parseInt(element.size);
                objValue.humansize = this.getWeight(element.size);
                objValue.favorite = (element.favorite == 0) ? false : true;
                objValue.ownerid = element.ownerid;
                objValue.ownername = element.ownerdisplayname;
                objValue.haspreview = (element.haspreview == 'false') ? false : true;
                objValue.isencrypted = element.isencrypted;
                objValue.sharepermissions = element.sharepermissions;
                objValue.etag = element.getetag;
                objValue.timestamp = timestamp;
                objValue.passedtime = this.getLastUpdateFunc(timestamp);
                objValue.humandate = this.getLastUpdateReal(timestamp);
                objValue.homepath = homepath;
                objValue.typecomplete = element.getcontenttype;
                objValue.isAttachment = tags;
                objValue.isConfig = false;

                dataValue.push(objValue);
            } else {
                let usedHREF = decodeURIComponent(href);
                let index = usedHREF.indexOf(window.sessionStorage.user) + window.sessionStorage.user.length + 1;
                homepath = usedHREF.slice(index);
            }
        }
        return dataValue;
    }

    /** GET NAME EXTENSION VPEC
     * Return result (obj) with name and extension of file/folder (VPEC ATTACHMENT ONLY)
     * @param value (string) href of file/folder
     * @param check (boolean) check if element is file
     **/
    getNameExtensionVPEC(value: string, check: boolean) {
        let result, name, extension, realname;

        let spacename = decodeURIComponent(value);
        let arrayname = spacename.split('/');
        let lastname = arrayname[arrayname.length - 1];
        if (!check) {
            realname = (lastname.length > 0) ? lastname : arrayname[arrayname.length - 2];
            extension = '';
        } else {
            let index = lastname.lastIndexOf('.');
            realname = lastname.slice(0, index);
            extension = lastname.slice(index, lastname.length);
        }

        if (realname.includes('[') && realname.indexOf('[') == 0)
            name = realname.slice(realname.indexOf(']') + 1);
        else name = realname;

        result = {
            realname: realname,
            name: name,
            extension: extension
        };

        return result;
    }

    /** GET RESPONSE USER LIST SHARE
     * @param array array response services 'sharedsearch?'
     * Get formatted response for autocomplete share user list (sidebar r)
     * return new array with only needed values
     **/
    getResponseUserListShare(array) {
        let dataValue = [];
        for (var i in array) {
            dataValue.push({
                label: array[i].label,
                id: (typeof array[i].value.shareWith === 'string') ? array[i].value.shareWith : array[i].value.shareWith.toString(),
                icon: `${globals.endpoint}/setting/info/avatar/getavatar?user=` + array[i].value.shareWith + `&size=30`
            })
        }
        return dataValue;
    }

    /**
     * GET RESPONSE PROTECTED FILES
     * Elaborate response service list all files
     * @param array
     */
    public getResponseProtectedFiles(array: any, username: string) {
        let dataValue = [];

        for (var i in array) {
            let obj = new FileSharingData();
            let href = decodeURIComponent(array[i].path);
            let completename = href.slice(href.lastIndexOf('/') + 1);
            let isFile = (completename.includes('.ven')) ? true : false;
            let extension = (isFile) ? '.ven' : '.ved';
            let realExtension = (isFile) ? this.getExtensionProtected(completename, isFile) : '';
            let type = (isFile) ? this.getType(realExtension) : 'folder';
            let image = this.getImage(type, [], realExtension);
            let date = new Date(array[i].getlastmodified).getTime();

            obj.name = completename.replace(realExtension + extension, '') + realExtension;
            obj.extension = extension;
            obj.path = href.slice(href.lastIndexOf(sessionStorage.getItem('user')) + sessionStorage.getItem('user').length).replace(completename, '');
            obj.id = array[i].fileid;
            obj.fileWeight = array[i].size;
            obj.lastUpdate = date;
            obj.tag = array[i].getetag;
            obj.owner = username;
            obj.ownerName = username;
            obj.ownerHome = username;
            obj.permission = array[i].permissions;
            obj.crypted = true;
            obj.file = isFile;
            obj.coded = true;
            obj.favorite = false;
            obj.share = false;
            obj.preview = false;
            obj.type = type;
            obj.image = image.img;
            obj.classimage = image.imgclass;
            obj.dateFunc = this.getLastUpdateFunc(date);
            obj.dateReal = this.getLastUpdateReal(date);
            obj.weight = this.getWeight(array[i].size);
            obj.path = href.slice(href.lastIndexOf(sessionStorage.getItem('user')) + sessionStorage.getItem('user').length).replace(completename, '');

            dataValue.push(obj);
        }
        return dataValue;
    }

    /** GET RESPONSE PUBLIC FILES **/
    getPublicFile(array, checkBoolean, infoFile) {
        if (Array.isArray(array)) {
            let dataValue = [];
            let basehref = '', userpermissions = '';
            for (let a in array) {
                let objValue = {} as PublicData;
                if (basehref.length == 0) {
                    basehref = array[a].href;
                    userpermissions = array[a].propstat[0].prop.permissions;
                } else {
                    let element = array[a].propstat[0].prop;
                    let hrefArray = array[a].href.split('/');
                    let completePath = array[a].href.replace('/public.php/webdav', '')
                    let completeName = (hrefArray[hrefArray.length - 1].length > 0) ? decodeURIComponent(hrefArray[hrefArray.length - 1]) : decodeURIComponent(hrefArray[hrefArray.length - 2]);
                    let isFile = (element.getcontenttype) ? true : false;
                    let extension = this.getExtension(completeName, isFile);
                    let type = (isFile) ? this.getType(element.getcontenttype) : 'folder';
                    let image = this.getImage(type, [], extension);
                    let size = parseInt(element.size);
                    let timestamp = new Date(element.getlastmodified).getTime();

                    let name, realname;
                    if (isFile) {
                        let getname = this.getNameFile(completeName);
                        name = getname.name;
                        realname = getname.realname;
                    } else {
                        name = decodeURIComponent(completeName);
                        realname = decodeURIComponent(completeName);
                    }

                    objValue.id = parseInt(element.fileid);
                    objValue.hide = false;
                    objValue.rename = false;
                    objValue.completeName = completeName;
                    objValue.name = name;
                    objValue.extension = this.getExtension(completeName, isFile);
                    objValue.weight = size;
                    objValue.milliLastupdate = timestamp;
                    objValue.url = '';
                    objValue.isfile = isFile;
                    objValue.preview = (element.haspreview == 'false') ? false : true;
                    objValue.isRow = false;
                    objValue.typecomplete = (isFile) ? element.getcontenttype : '';
                    objValue.type = type;
                    objValue.image = image.img;
                    objValue.classimage = image.imgclass;
                    objValue.pastHumandate = this.getLastUpdateFunc(timestamp);
                    objValue.humanDate = this.getLastUpdateReal(timestamp);
                    objValue.humanWeight = this.getWeight(size);
                    objValue.completepath = completePath;
                    objValue.permissions = this.getPermissions(element.permissions, isFile);

                    dataValue.push(objValue);
                }
            }

            let result = {
                dataValue: dataValue,
                userpermissions: userpermissions
            };

            return result;
        } else {
            let element = array.propstat[0].prop;
            let hrefArray = array.href.split('/');
            let completePath = array.href.replace('public.php/webdav/', '');
            let completeName = (infoFile) ? infoFile.completename : ((hrefArray[hrefArray.length - 1].length > 0) ? decodeURIComponent(hrefArray[hrefArray.length - 1]) : decodeURIComponent(hrefArray[hrefArray.length - 2]));
            let isFile = (element.getcontenttype) ? true : false;
            let extension = this.getExtension(completeName, isFile);
            let type = (element.getcontenttype) ? this.getType(element.getcontenttype) : 'folder';
            let image = this.getImage(type, [], extension);
            let size = parseInt(element.size);
            let timestamp = new Date(element.getlastmodified).getTime();

            let name, realname;
            if (isFile) {
                let getname = this.getNameFile(completeName);
                name = getname.name;
                realname = getname.realname;
            } else {
                name = decodeURIComponent(completeName);
                realname = decodeURIComponent(completeName);
            }
            let objValue = {} as PublicData;

            objValue.id = parseInt(element.fileid);
            objValue.hide = false;
            objValue.rename = false;
            objValue.completeName = completeName;
            objValue.name = name;
            objValue.extension = extension;
            objValue.weight = size;
            objValue.milliLastupdate = timestamp;
            objValue.url = '',
                objValue.isfile = isFile;
            objValue.preview = (element.haspreview == 'false') ? false : true;
            objValue.isRow = false;
            objValue.typecomplete = element.getcontenttype;
            objValue.type = type;
            objValue.image = image.img;
            objValue.classimage = image.imgclass;
            objValue.pastHumandate = this.getLastUpdateFunc(timestamp);
            objValue.humanDate = this.getLastUpdateReal(timestamp);
            objValue.humanWeight = this.getWeight(size);
            objValue.completepath = completePath;
            objValue.permissions = this.getPermissions(element.permissions, isFile);

            return objValue;
        }
    }

    /** GET RESPONSE PUBLIC FOLDER **/
    getPublicFolder(array, info, checkname) {
        if (Array.isArray(array)) {
            let dataValue = [];
            let basehref = '', userpermissions;
            for (let a in array) {
                let objValue = {} as PublicData;
                if (basehref.length == 0) {
                    basehref = array[a].href;
                    userpermissions = array[a].propstat[0].prop.permissions;
                } else {
                    let element = array[a].propstat[0].prop;
                    if (!element.getcontenttype) {
                        let hrefArray = array[a].href.split('/');
                        let completePath = array[a].href.replace(basehref, '')
                        let completeName = (hrefArray[hrefArray.length - 1].length > 0) ? decodeURIComponent(hrefArray[hrefArray.length - 1]) : decodeURIComponent(hrefArray[hrefArray.length - 2]);
                        let isFile = (element.getcontenttype) ? true : false;
                        let extension = this.getExtension(completeName, isFile);
                        let type = (isFile) ? this.getType(element.getcontenttype) : 'folder';
                        let image = this.getImage(type, [], extension);
                        let size = parseInt(element.size);
                        let timestamp = new Date(element.getlastmodified).getTime();
                        let name, realname;
                        if (isFile) {
                            let getname = this.getNameFile(completeName);
                            name = getname.name;
                            realname = getname.realname;
                        } else {
                            name = decodeURIComponent(completeName);
                            realname = decodeURIComponent(completeName);
                        }

                        if (!checkname.includes(name)) {
                            objValue.id = parseInt(element.fileid);
                            objValue.hide = false;
                            objValue.rename = false;
                            objValue.completeName = completeName;
                            objValue.name = name;
                            objValue.extension = this.getExtension(completeName, isFile);
                            objValue.weight = size;
                            objValue.milliLastupdate = timestamp;
                            objValue.url = '';
                            objValue.isfile = isFile;
                            objValue.preview = (element.haspreview == 'false') ? false : true;
                            objValue.isRow = false;
                            objValue.typecomplete = (isFile) ? element.getcontenttype : '';
                            objValue.type = type;
                            objValue.image = image.img;
                            objValue.classimage = image.imgclass;
                            objValue.pastHumandate = this.getLastUpdateFunc(timestamp);
                            objValue.humanDate = this.getLastUpdateReal(timestamp);
                            objValue.humanWeight = this.getWeight(size);
                            objValue.completepath = completePath;
                            objValue.permissions = this.getPermissions(element.permissions, isFile);

                            dataValue.push(objValue);
                        }
                    }
                }
            }
            return dataValue;
        } else {
            let element = array.propstat[0].prop;
            if (element.getcontenttype) {
                let type = (info.isFile) ? this.getType(element.getcontenttype) : 'folder'
                let image = this.getImage(type, [], info.extension);
                let size = parseInt(element.size);
                let timestamp = new Date(element.getlastmodified).getTime();
                let objValue = {} as PublicData;

                if (!checkname.includes(info.name)) {
                    objValue.id = parseInt(element.fileid);
                    objValue.hide = false;
                    objValue.rename = false;
                    objValue.completeName = info.completename;
                    objValue.name = info.name;
                    objValue.extension = info.extension;
                    objValue.weight = size;
                    objValue.milliLastupdate = timestamp;
                    objValue.url = info.url,
                        objValue.isfile = info.isFile,
                        objValue.preview = (element.haspreview == 'false') ? false : true;
                    objValue.isRow = false;
                    objValue.typecomplete = element.getcontenttype;
                    objValue.type = type;
                    objValue.image = image.img;
                    objValue.classimage = image.imgclass;
                    objValue.pastHumandate = this.getLastUpdateFunc(timestamp);
                    objValue.humanDate = this.getLastUpdateReal(timestamp);
                    objValue.humanWeight = this.getWeight(size);
                    objValue.completepath = '';
                    objValue.permissions = this.getPermissions(element.permissions, info.isFile);

                    return objValue;
                }
            }
        }
    }

    getPermissions(permissions, isfile) {
        let allPermission;
        if (permissions) {
            if (isfile) {
                allPermission = {
                    isReadable: (permissions.includes('G')) ? true : false,
                    isUpdateable: (permissions.includes('W')) ? true : false,
                    isDeletable: (permissions.includes('D')) ? true : false,
                    isCrearable: (permissions.includes('CK')) ? true : false,
                    isSharable: (permissions.includes('R')) ? true : false,
                }
            } else {
                allPermission = {
                    isReadable: (permissions.includes('G')) ? true : false,
                    isUpdateable: (permissions.includes('CK')) ? true : false,
                    isDeletable: (permissions.includes('D')) ? true : false,
                    isCrearable: (permissions.includes('CK')) ? true : false,
                    isSharable: (permissions.includes('R')) ? true : false,
                }
            }
            return allPermission;
        }
    }

    /** GET GROUP FOLDER SETTINGS
     * Get the list of all group folder for setting
     * @param array
     **/
    getGroupFolderSettings(array: any) {
        let result = [];
        for (var i in array) {
            let objValue = new GroupFolder();
            let arrayPermission = [];
            let size = parseInt(array[i].quota);
            let grouparray = this.getGroupFolderSettingsPermissions(array[i].groups);

            for (var a in array[i].manage) {
                let name = array[i].manage[a].displayname + ' (' + array[i].manage[a].type + ')';
                arrayPermission.push(name)
            }

            objValue.id = array[i].id;
            objValue.name = array[i].mount_point;
            objValue.groups = Object.keys(array[i].groups).toString().replace(/,/g, ', ');
            objValue.groupsArray = Object.keys(array[i].groups);
            objValue.groupsObj = grouparray;
            objValue.quota = (size == -3) ? 'Unlimited' : this.getWeight(size);
            objValue.realquota = (size == -3) ? 'Unlimited' : this.getWeight(size);
            objValue.size = array[i].size;
            objValue.permissions = arrayPermission;
            objValue.permissionsObj = array[i].manage;
            objValue.acl = array[i].acl;

            result.push(objValue);
        }
        return result;
    }

    /** GET GROUP FOLDER SETTINGS PERMISSIONS
     * Fix group permissions
     **/
    getGroupFolderSettingsPermissions(array: any) {
        let newarray = [];
        for (var a in array) {
            let permission = array[a];
            let write = false, share = false, cancel = false;
            if (permission == '31') write = !write, share = !share, cancel = !cancel;
            else if (permission == '7') write = !write;
            else if (permission == '9') cancel = !cancel;
            else if (permission == '15') write = !write, cancel = !cancel;
            else if (permission == '17') share = !share;
            else if (permission == '23') write = !write, share = !share;
            else if (permission == '25') share = !share, cancel = !cancel;

            let obj = {
                name: a,
                permissions: permission,
                write: write,
                share: share,
                cancel: cancel,
            }

            newarray.push(obj);
        }
        return newarray;
    }

    /** COPY WITHOUT TYPE
     * Used on duplicate files dialog
     * @param original (any) array of obj with duplicate files
     **/
    copyWithoutType(duplicate: any) {
        let array = [];
        for (var i = 0; i < duplicate.length; i++) {
            let obj = {} as Copy;
            let extension = this.getExtension(duplicate[i].name, true);
            let image = (extension) ? this.getImage('', [], extension) : this.getImage('folder', [], extension);

            obj.name = duplicate[i].name;
            obj.timestamp = duplicate[i].lastModified;
            obj.byte = duplicate[i].size;
            obj.image = image.img;
            obj.classimage = image.imgclass;
            obj.weight = this.getWeight(duplicate[i].size);
            obj.date = this.getLastUpdateReal(duplicate[i].lastModified);

            array.push(obj);
        }
        return array;
    }

    /** ELABORATE USER SETTINGS
     * Get enabled and disabled user
     * @param data (any) response
     * @param check (boolean) check the page for user enabled/disabled
     **/
    elaborateUserSettings(data: any, check: boolean, offset: boolean) {
        let array = [];
        if (offset) {
            let objectEmpty = new settingsUser();
            array.push(objectEmpty);
        }
        for (var i in data) {
            let object = new settingsUser();

            let arrayGroups = [];
            data[i].groups.forEach(element => {
                arrayGroups.push(element.displayName);
            });

            if (data[i].enabled == check) {
                object.id = data[i].id;
                object.username = data[i].id;
                object.accountname = data[i].displayname;
                object.password = '';
                object.email = data[i].email;
                object.groups = data[i].groups;
                object.image = `${globals.endpoint}/setting/info/avatar/getavatar?user=` + data[i].id + `&size=30`;
                object.quota = (data[i].quota.quota == -3) ? this.dict.getDictionary('nolimits') : this.getWeight(data[i].quota.quota);
                object.quotaValue = (data[i].quota.quota == -3) ? this.dict.getDictionary('nolimits') : this.getWeight(data[i].quota.quota);
                object.create = false;

                array.push(object);
            }
        }
        return array;
    }

    /** ELABORATE USER SETTINGS with new api call (avatar)
     * Get enabled and disabled user
     * @param data (any) response
     * @param check (boolean) check the page for user enabled/disabled
     **/
    elaborateUserSettingsNew(data: any, check: boolean, offset: boolean) {
        let array = [];
        /*if(offset){
            let objectEmpty = new settingsUser();
            array.push(objectEmpty);
        }*/
        for (var i in data) {
            let object = new settingsUser();

            let arrayGroups = [];
            data[i].groups.forEach(element => {
                arrayGroups.push(element.displayName);
            });

            if (data[i].isUserManager == true && arrayGroups.includes('admin')) {
                var userRole = 'GGU';
            } else if (data[i].isFolderManager == true && arrayGroups.includes('admin')) {
                var userRole = 'FGM';
            } else if (arrayGroups.includes('admin') && data[i].isUserManager == false && data[i].isFolderManager == false) {
                var userRole = 'Admin';
            } else {
                var userRole = 'User';
            }

            if (data[i].enabled == check) {
                object.id = data[i].uid;
                object.username = data[i].uid;
                object.userManager = data[i].isUserManager;
                object.folderManager = data[i].isFolderManager;
                object.accountname = data[i].displayName;
                object.password = '';
                object.email = data[i].emailAddress;
                object.groups = arrayGroups;
                object.image = 'data:image/png;base64,' + data[i].avatar;
                object.quota = (data[i].quota == 'none') ? this.dict.getDictionary('nolimits') : data[i].quota;
                object.quotaValue = (data[i].quota == 'none') ? this.dict.getDictionary('nolimits') : data[i].quota;
                object.create = false;
                object.external = data[i].isExternal;
                object.role = userRole;
                object.isGuest = data[i].isGuest;

                array.push(object);
            }
        }
        return array;
    }

    /** ELABORATE USER SETTINGS with new api call (avatar)
     * Get enabled and disabled user
     * @param data (any) response
     * @param check (boolean) check the page for user enabled/disabled
     **/
    elaborateSamlUserSettings(data: any, check: boolean, offset: boolean) {
        let array = [];
        for (var i in data) {
            let object = new settingsSamlUser();

            let arrayGroups = [];
            if (data[i].groups) {
                data[i].groups.forEach(element => {
                    arrayGroups.push(element.displayName);
                });
            }

            var userRole;
            if (data[i].isUserManager && arrayGroups.includes('admin')) {
                userRole = 'GGU';
            } else if (data[i].isFolderManager && arrayGroups.includes('admin')) {
                userRole = 'FGM';
            } else if (arrayGroups.includes('admin') && !(data[i].isUserManager) && !(data[i].isFolderManager)) {
                userRole = 'Admin';
            } else userRole = 'User';

            if (data[i].enabled == check && (data[i].isExternal && data[i].isSAMLUser)) {
                data[i].SAMLUserData.dataInserimento = new Date(data[i].SAMLUserData.dataInserimento * 1000);
                data[i].SAMLUserData.dataCessazione = new Date(data[i].SAMLUserData.dataCessazione * 1000);

                object.id = data[i].uid;
                object.username = data[i].uid;
                object.userManager = data[i].isUserManager;
                object.accountname = data[i].displayName;
                object.password = '';
                object.email = data[i].emailAddress;
                object.groups = arrayGroups;
                object.image = 'data:image/png;base64,' + data[i].avatar;
                object.quota = (data[i].quota == 'none') ? this.dict.getDictionary('nolimits') : data[i].quota;
                object.quotaValue = (data[i].quota == 'none') ? this.dict.getDictionary('nolimits') : data[i].quota;
                object.create = false;
                object.userinfo = data[i].SAMLUserData;
                object.role = userRole;
                object.folderManager = data[i].isFolderManager;
                object.apps = data[i].userApps;

                array.push(object);
            }
        }
        return array;
    }

    /**
  * GET RESPONSE ALL FILES SIGNED
  * Elaborate response service list all files signed
  * @param array
  */
    public getResponseSignedDocumentsFiles(array, username, folder) {
        var username = (!!username) ? username : '';
        var folder = (!!folder) ? folder : '';
        let dataValue = [];

        // tslint:disable-next-line: forin
        for (let i in array) {
            let obj = new FileSharingData();
            let href = decodeURIComponent(array[i].path);
            let completename = href.slice(href.lastIndexOf('/') + 1);
            let realExtension = this.getExtension(completename, true);
            let type = this.getType(realExtension);
            let image = this.getImage(type, [], realExtension);
            let date = new Date(array[i].getlastmodified).getTime();

            obj.name = completename.replace(realExtension, '');
            obj.extension = realExtension;
            obj.path = href.slice(href.lastIndexOf(sessionStorage.getItem('user')) + sessionStorage.getItem('user').length).replace(completename, '');
            obj.id = array[i].fileid;
            obj.fileWeight = array[i].size;
            obj.lastUpdate = date;
            obj.tag = array[i].getetag;
            obj.owner = username;
            obj.ownerName = username;
            obj.ownerHome = username;
            obj.permission = array[i].permissions;
            obj.crypted = false;
            obj.file = true;
            obj.coded = false;
            obj.favorite = false;
            obj.share = false;
            obj.preview = false;
            obj.type = type;
            obj.image = image.img;
            obj.classimage = image.imgclass;
            obj.dateFunc = this.getLastUpdateFunc(date);
            obj.dateReal = this.getLastUpdateReal(date);
            obj.weight = this.getWeight(array[i].size);

            dataValue.push(obj);
        }
        return dataValue;
    }

    /** GET FILE LABELS
     * Elaborate response and get files labels
     * @param array
     * @param id
     */
    getFileLabels(array: any) {
        let response = [];

        if (!Array.isArray(array)) return response;

        for (var i in array) {
            if (array[i].href) {
                let arraycheck = array[i].href.split('/');
                if (arraycheck[arraycheck.length - 1]) {
                    let name = array[i].propstat.prop.displayname;
                    let id = array[i].propstat.prop.id;
                    response.push(name);
                }
            }
        }
        return response;
    }

    /** GET TAGS **/
    getTags(data: any) {
        let array = [];
        for (var i in data) {
            let element = data[i].propstat.prop;
            if (data[i].propstat.status.includes('200')) {
                let obj = new TagsList();
                obj.id = element.id;
                obj.name = element.displayname;

                array.push(obj);
            }
        }
        array.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
        return array;
    }

    /** GET FILES BY TAGS
     * @param data (any) array of files
     **/
    getFilesByTags(data: any) {
        let array = [];
        for (var i in data) {
            let obj = new FileByTag();
            let href = decodeURIComponent(data[i].href);
            let file = data[i].propstat[0].prop;

            let completename = href.slice(href.lastIndexOf('/') + 1);
            let isFile = (completename.indexOf('.') > 0) ? true : false;
            let extension = (isFile) ? completename.slice(completename.lastIndexOf('.')) : '';
            let realExtension = this.getExtensionProtected(completename, isFile)
            let date = new Date(file.getlastmodified).getTime();
            let coded = (Array.isArray(file.tags.tag) && file.tags.tag.includes('vEncryptedFile: true')) ? true : false

            let image;
            let extensionImg = (coded) ? realExtension : extension;

            if (Array.isArray(file.tags) || extensionImg || (coded && Array.isArray(file.tags))) {
                image = this.getImage(this.type, file.mounttype, extensionImg);
            } else {
                image = {
                    img: (typeof file.tags.tag == 'string') ? 'gesture' : 'attachment',
                    imgclass: 'folder',
                }
            }

            obj.id = file.fileid;
            obj.completename = completename;
            obj.name = completename.replace(extension, '');
            obj.extension = extension;
            obj.path = href.slice(href.lastIndexOf(sessionStorage.getItem('user')) + sessionStorage.getItem('user').length).replace(completename, '');
            obj.owner = file.ownerid;
            obj.permissions = file.permissions;
            obj.weightByte = file.size;
            obj.weightHuman = this.getWeight(file.size);
            obj.date = date;
            obj.dateHuman = this.getLastUpdateFunc(date);
            obj.dateReal = this.getLastUpdateReal(date);
            obj.image = image.img;
            obj.imageClass = image.imgclass;
            if (file.sharetypes.length === 0) {
                obj.shareTypes = [];
            } else if (file.sharetypes.sharetype !== undefined && file.sharetypes.sharetype.length > 0) {
                obj.shareTypes = file.sharetypes.sharetype;
            } else {
                obj.shareTypes = [file.sharetypes.sharetype];
            }

            obj.profile = (file.ownerid) ? `${globals.endpoint}/setting/info/avatar/getavatar?user=` + file.ownerid + `&size=30` : '';

            obj.isFile = isFile;
            obj.favorite = (file.favorite == 1) ? true : false;
            obj.share = (sessionStorage.getItem('user') != file.ownerid) ? true : false;
            obj.coded = coded;

            array.push(obj);
        }

        return array;
    }

    getResponseFlow(array, username, folder) {
        var username = (!!username) ? username : '';
        var folder = (!!folder) ? folder : '';
        let dataValue = [];
        let home, homeOwner, ko = '404';

        for (let a in array) {
            let objValue = new FileSharingData();
            let path = array[a].href;
            for (let b in array[a].propstat) {
                let child = array[a].propstat[b].prop;
                if (!array[a].propstat[b].status.includes(ko)) {
                    if (!home) {
                        home = path.replace(' ', '%20');
                        homeOwner = username;
                    } else if (parseInt(child.fileid) > 0 && (child.tags.length == 0 || child.tags.tag.length == 0 || child.tags.tag.includes('SignedFile'))
                        && child.mounttype != 'external' && child.mounttype != 'group') {
                        let dateBE = new Date(child.getlastmodified).getTime();
                        let typeBE = child.getcontenttype;
                        let isFileBE = (child.getcontenttype) ? true : false;
                        let bytesBE = child.size;
                        let href = array[a].href.replace(home, '');
                        let nameBE = (isFileBE) ? decodeURIComponent(href) : decodeURIComponent(href).slice(0, -1);
                        let index = home.indexOf(window.sessionStorage.user) + window.sessionStorage.user.length + 1;
                        let homepath = home.slice(index);

                        let getname;
                        if(isFileBE) getname = this.getNameFile(nameBE);
                        let name = (isFileBE)? getname.name : decodeURIComponent(nameBE);
                        let realname = (isFileBE)? getname.realname : decodeURIComponent(nameBE);

                        if (!/\S+@\S+\.\S+/.test(name)) {
                            let extension = this.getExtension(nameBE, isFileBE);
                            this.type = (isFileBE) ? this.getType(typeBE) : 'folder';
                            let image;

                            if (Array.isArray(child.tags) || extension) {
                                image = this.getImage(this.type, child.mounttype, extension);
                            } else {
                                image = {
                                    img: (typeof child.tags.tag == 'string') ? 'gesture' : 'attachment',
                                    imgclass: 'folder',
                                }
                            }

                            let tags = false;
                            for (var k in child.tags.tag) {
                                if ((child.tags.tag[k].includes('vPecAttachmentsFolder') && child.tags.tag[k].includes('true'))
                                    || child.tags.tag[k].includes('mailDateTime'))
                                    tags = true;
                            }

                            objValue.id = child.fileid;
                            objValue.name = name;
                            objValue.realname = realname;
                            objValue.extension = extension;
                            objValue.fileWeight = bytesBE;
                            objValue.lastUpdate = dateBE;
                            objValue.tag = child.getetag;
                            objValue.owner = child.ownerid;
                            objValue.ownerName = child.ownerdisplayname;
                            objValue.ownerHome = child.homeOwner;
                            objValue.permission = child.permissions;
                            objValue.crypted = (Array.isArray(child.tags)) ? false : true;

                            objValue.file = (isFileBE) ? true : false;
                            objValue.favorite = (child.favorite == 1) ? true : false;
                            objValue.share = (homeOwner != child.ownerid) ? true : false;
                            objValue.preview = (child.haspreview == 'true') ? true : false;

                            objValue.typecomplete = child.getcontenttype;
                            objValue.type = (!Array.isArray(child.mounttype) || child.mounttype != 'shared') ? child.mounttype : this.type;
                            objValue.image = image.img;
                            objValue.classimage = image.imgclass;
                            objValue.dateFunc = this.getLastUpdateFunc(dateBE);
                            objValue.dateReal = this.getLastUpdateReal(dateBE);
                            objValue.weight = this.getWeight(bytesBE);
                            objValue.path = homepath;
                            if (child.sharetypes.length === 0) {
                                objValue.shareTypes = [];
                            } else if (child.sharetypes.sharetype !== undefined && child.sharetypes.sharetype.length > 0) {
                                objValue.shareTypes = child.sharetypes.sharetype;
                            } else {
                                objValue.shareTypes = [child.sharetypes.sharetype];
                            }
                            if (child.ownerid) {
                                objValue.profile_pic_url = `${globals.endpoint}/setting/info/avatar/getavatar?user=` + child.ownerid + `&size=30`;
                            }
                            objValue.isAttachment = tags;

                            dataValue.push(objValue);
                        }
                    }
                }
            }
        }
        return dataValue;
    }

    /** USER BY GROUPS SETTINGS
     * Get enabled and disabled user
     * @param data (any) response
     * @param check (boolean) check the page for user enabled/disabled
     **/
    userByGroupsSettings(data: any) {
        let array = [];
        for (var i in data) {
            let object = new settingsUser();

            object.id = data[i].id;
            object.username = data[i].id;
            object.accountname = data[i].displayname;
            object.password = '';
            object.email = data[i].email;
            object.groups = data[i].groups;
            object.image = `${globals.endpoint}/setting/info/avatar/getavatar?user=` + data[i].id + `&size=30`;
            object.quota = (data[i].quota.quota == -3) ? this.dict.getDictionary('nolimits') : this.getWeight(data[i].quota.quota);
            object.quotaValue = (data[i].quota.quota == -3) ? this.dict.getDictionary('nolimits') : this.getWeight(data[i].quota.quota);
            object.create = false;

            array.push(object);
        }
        return array;
    }

    userGroupsSettings(data: any) {
        let array = [];
        for (var i in data) {
            let object = new settingsUser();
            let arrayGroups = [];
            if(data[i].groups) {
                data[i].groups.forEach(element => {
                    arrayGroups.push(element.displayName);
                });
            }

            var userRole;
            if (data[i].isUserManager && arrayGroups.includes('admin')) {
                userRole = 'GGU';
            } else if (data[i].isFolderManager && arrayGroups.includes('admin')) {
                userRole = 'FGM';
            } else if (arrayGroups.includes('admin') && !(data[i].isUserManager) && !(data[i].isFolderManager)) {
                userRole = 'Admin';
            } else userRole = 'User';

            object.id = data[i].uid;
            object.username = data[i].uid;
            object.userManager = data[i].isUserManager;
            object.folderManager = data[i].isFolderManager;
            object.accountname = data[i].displayName;
            object.password = '';
            object.email = data[i].emailAddress;
            object.groups = arrayGroups;
            object.image = 'data:image/png;base64,' + data[i].avatar;
            object.quota = (data[i].quota == 'none') ? this.dict.getDictionary('nolimits') : data[i].quota;
            object.quotaValue = (data[i].quota == 'none') ? this.dict.getDictionary('nolimits') : data[i].quota;
            object.create = false;
            object.external = data[i].isExternal;
            object.role = userRole;

            array.push(object);
        }
        return array
    }

    /** BUILD STEPS
     * Used in creation of notes
     * @param resultText
     **/
    buildSteps(resultText) {
        let steps = [];

        for (var i = 0; i < resultText.length; i++) {
            let obj = {
                stepType: 'replace',
                from: i + 1,
                to: i + 1,
                slice: {
                    content: [{
                        type: 'text',
                        text: resultText[i],
                    }]
                }
            };
            steps.push(obj);
        }
        return steps;
    }

    getGuests(array: any) {
        let arrayGuest = [];
        for (var i in array) {
            let objectEmpty = new userGuest();
            let element = array[i];
            if (element.vcard) {
                objectEmpty.id = element.id;
                objectEmpty.name = element.vcard.N[1];
                objectEmpty.surname = element.vcard.N[0];
                objectEmpty.email = element.email;
                objectEmpty.start = element.vcard.BDAY;
                objectEmpty.end = element.vcard.DEATHDATE;
                objectEmpty.company = element.vcard.ORG[0];
                objectEmpty.managerId = element.vcard.ORG[1];
                objectEmpty.managerName = element.vcard.ORG[2];
                objectEmpty.managerSurname = element.vcard.ORG[3];
                objectEmpty.managerMail = element.vcard.ORG[4];
                objectEmpty.apps = element.userApps;
                objectEmpty.appsString = element.userApps? element.userApps.join(' + ') : 'No Apps';
                arrayGuest.push(objectEmpty);
            }
        }

        return arrayGuest;
    }

}
