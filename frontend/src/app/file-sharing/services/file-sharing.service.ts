import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { globals } from 'src/config/globals';
import { TableComponent } from 'src/app/file-sharing/components/table/table.component';
import { Utilities } from 'src/app/file-sharing/utilities';
import { BehaviorSubject } from 'rxjs';
import { GlobalVariable } from '../../globalviarables';

@Injectable({
  providedIn: 'root'
})
export class FileSharingService {

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient, private global: GlobalVariable) { }
  utility = new Utilities();
  infoLoad = new BehaviorSubject<boolean>(false);

  setInfoLoad(load: boolean) {
    this.infoLoad.next(load);
  }

/**
 * Get atime tab closed
 */
 getTimeClosed(): Observable<any> {
  return this.http.get<any>(`${globals.endpoint}/vdeskintegration/timeStampServer`);
}

  /**
 * Get all files by session token
 */
  getAllFiles(path): Observable<any> {
    let name = encodeURIComponent(path);
    return this.http.get<any>(`${globals.endpoint}/files?path=` + name);
  }

  /**
   * Open folder
   */
  getOpenFolder(name: string): Observable<any> {
    let path = encodeURIComponent(name);
    return this.http.get<any>(`${globals.endpoint}/files?path=` + path);
  }

  /**
   * Get recents by session token
   */
  getRecents(): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/recents`);
  }

  /**
   * Delete file by session token
   */
  delete(uri: any): Observable<any> {
    let name = encodeURIComponent(uri);
    return this.http.get<any>(`${globals.endpoint}/delete?uri=` + name);
  }

  /**
   * Get shared by you (in DRIVE: shared with others) by session token
   */
  getSharedByYou(): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/sharedwith?withme=false&tag=true`);
  }

  /**
   * Get shared by others (in DRIVE: shared with you) by session token
   */
  getSharedByOthers(): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/sharedwith?withme=true&tag=true`);
  }

  /**
   * Get remote shared by others (in DRIVE: remote shared with you) by session token
   */
  getSharedByOthersRemote(): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/sharedwithyouremote?tag=true`);
  }

  /**
   * Get shared by link via session token
   */
  getSharedByLink(): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/sharedwith?withme=false&tag=true`);
  }

  /**
   * Add to favorite
   */
  addToFavorite(uri: any, isRemove): Observable<any> {
    let name = encodeURIComponent(uri);
    return this.http.get<any>(`${globals.endpoint}/add-to-favorite?uri=` + name + '&is-remove=' + isRemove);
  }

  /**
   * Download a file
   */
  download(uri: any, filename, extension, saveAs) {
    var download = document.createElement('a');
    let uriEncode = encodeURIComponent(uri);
    let uriName = encodeURIComponent(filename);
    let uriSave = encodeURIComponent(saveAs);
    if(saveAs=='downloadversion'){
      var url = `${globals.endpoint}/downloaddav?uri=` + uriEncode + `&filename=` + uriName + extension + '&saveAs='+ uriName + extension + '&AddressIp=' + this.global.addressIp;
    }else if(saveAs=='download'){
      var url = `${globals.endpoint}/download-folder?dir=` + uriEncode + `&files=` + uriName + '&saveAs=' + uriSave + '&AddressIp=' + this.global.addressIp; 
    }else if (extension === "") {
      var url = `${globals.endpoint}/download-folder?dir=` + uriEncode +'&filename=' + uriName + '&saveAs=' + uriSave + '&AddressIp=' + this.global.addressIp; 
    } else {
      var url = `${globals.endpoint}/download?uri=` + uriEncode + `&filename=` + uriName + extension + '&saveAs=' + uriSave + extension + '&AddressIp=' + this.global.addressIp; 
    } 
    download.href = url;
    download.click();
    //@ts-ignore
    //$('.tableDiv').prepend('<img class="loader" src="/assets/img/loader.gif">');
    
    checkDownload();
    function checkDownload() {
      setTimeout(function() {
        //@ts-ignore
        if (getCookie('downloadFinish') === "0") {
          checkDownload(); 
        } else {
          //@ts-ignore
          //$('.loader').remove();
        }
      }, 1000);
    }
  }
  
  /**
   * Upload files
   */
  upload(filename:string, file: any): Observable<any> {
    const fileAsBlob = new Blob([file]);
    return this.http.post<any>(`${globals.endpoint}/upload?uri=`+filename, fileAsBlob, { reportProgress: true, observe: 'events' });
  }
  /**
   * Create a folder
   */
  createFolder(folderName): Observable<any> {
    folderName = encodeURIComponent(folderName);
    return this.http.get<any>(`${globals.endpoint}/createfolder?folder=`+folderName);
  }

  /** RENAME FILE/FOLDER
   * @param source source path with name file/folde and extension
   * @param destination destination path with name file/folde and extension
   */
  renameFileFolder(source, destination): Observable<any> {
    let uriSource = encodeURIComponent(source);
    let uriDestination = encodeURIComponent(destination);
    return this.http.get<any>(`${globals.endpoint}/move?source=` + uriSource + '&destination=' + uriDestination);
  }

  /** MOVE FILE/FOLDER
   * @param source source path with name file/folde and extension
   * @param destination destination path with name file/folde and extension
   */
  moveFileFolder(source, destination): Observable<any> {
    let uriSource = encodeURIComponent(source);
    let uriDestination = encodeURIComponent(destination);
    return this.http.get<any>(`${globals.endpoint}/move?source=` + uriSource + '&destination=' + uriDestination);
  }

  /** GET DELETED FILES **/
  getDeletedFiles(): Observable<any>{
    return this.http.get<any>(`${globals.endpoint}/trash`);
  }

  /** GET DELETED FILES DEFINITELY FROM DELETE PAGE **/
  getDeletedDefinitelyFiles(name, time): Observable<any>{
    return this.http.get<any>(`${globals.endpoint}/trashbin?trashbinfilename=` + name + '&trashbindeletiontime=' + time);
  }

  /** RESTORE FILE FROM TRASH **/
  restoreFile(path, filename): Observable<any>{
    return this.http.get<any>(`${globals.endpoint}/restore?path=` + path + '&filename=' + filename);
  }

  /** GET LIST EXTERNAL ARCHIVES **/
  getExternalArchives(){
    return this.http.get<any>(`${globals.endpoint}/mounts`);
  }

  /** NAVIGATE DELITED FOLDER **/
  navigateDeletedFolder(path){
    return this.http.get<any>(`${globals.endpoint}/filestrash?path=` + path);
  }

  /** GET LIST FAVORITES **/
  getListFavorites(){
    const token = sessionStorage.getItem('access_token');
    return this.http.get<any>(`${globals.endpoint}/favorites?requesttoken=` + token);
  }

  /** GET LIST SIGNED **/
  getListSigned() {
    const token = sessionStorage.getItem('access_token');
    return this.http.post<any>(`${globals.endpoint}/signature/list/files?requesttoken=` + token, {});
  }

  /** GET STORAGE SPACE **/
  getStorageSpace(){
    const token = sessionStorage.getItem('access_token');
    return this.http.get<any>(`${globals.endpoint}/getstoragestat?dir=&requesttoken=` + token);
  }

  /** COPY FILE
   * For now this function copy a file/folder in the same directory
   **/
  copyFile(source, destination){
    let uriSource = encodeURIComponent(source);
    let uriDestination = encodeURIComponent(destination);
    const token = sessionStorage.getItem('access_token');
    return this.http.get<any>(`${globals.endpoint}/copy?source=`+ uriSource +'&destination='+ uriDestination +'&requesttoken=' + token);
  }

  /** GET ACTIVITY LIST **/
  getActivityList(id: number){
    const token = sessionStorage.getItem('access_token');
    return this.http.get<any>(`${globals.endpoint}/activity/filter?objectid=`+ id +'&requesttoken=' + token);
  }

  /** GET LIST LABELS **/
  getListLabels(){
    const token = sessionStorage.getItem('access_token');
    return this.http.get<any>(`${globals.endpoint}/listtags?requesttoken=` + token);
  }

  /** ADD TAG FILE **/
  addTagFile(id: number, fileid: number, body){
    const token = sessionStorage.getItem('access_token');
    return this.http.post<any>(`${globals.endpoint}/addtagtofile?requesttoken=` + token + '&fileid=' +fileid+ '&id=' +id, body);
  }

  /** ADD NEW TAG **/
  addNewTag(body){
    const token = sessionStorage.getItem('access_token');
    return this.http.post<any>(`${globals.endpoint}/addtag?requesttoken=` + token, body);
  }

  /** GET TAGS FILE
   * Get tags of a file
   * 3.1.2 bridgeAPI
   * GET
   * @param fileid (string) id user
   **/
  getTagsFile(fileid: number){
    const token = sessionStorage.getItem('access_token');
    return this.http.get<any>(`${globals.endpoint}/getfile?fileid=` + fileid + `&requesttoken=` + token);
  }

  /** GET LIST LABELS **/
  removeTagFromFile(fileid: number, id: number){
    const token = sessionStorage.getItem('access_token');
    return this.http.get<any>(`${globals.endpoint}/removetagtofile?requesttoken=` + token + '&fileid=' + fileid + '&id=' + id);
  }

  /**
   * Get the files/folders list by label ids and session token
   * @param id string of label ids
   */
  getFilesByTags(id: any): Observable<any> {
    const token = sessionStorage.getItem('access_token');
    return this.http.get<any>(`${globals.endpoint}/tags?id=` + id + `&requesttoken=` + token);
  }

  /** GET VERSION FILE FOLDER **/
  getVersionFileFolder(fileid: number){
    const token = sessionStorage.getItem('access_token');
    return this.http.get<any>(`${globals.endpoint}/version?requesttoken=` + token + '&fileid=' + fileid);
  }

  /** RESTORE VERSION FILE FOLDER
   * @param url (string) url of the chosen file
   * Restore old version of the chosen file
   **/
  restoreVersionFileFolder(url: string){
    const token = sessionStorage.getItem('access_token');
    return this.http.get<any>(`${globals.endpoint}/restoreversion?requesttoken=` + token + '&href=' + url);
  }

  /** GET SEARCH RESULT
   * Get the search result by access token
   * @param query is input string in searchbar header
   * @param app is filter value in searchbar header
   */
  getSearchResult(query: any) {
    const token = sessionStorage.getItem('access_token');
    return this.http.get<any>(`${globals.endpoint}/search?query=` + query + `&inapps=files&page=1&size=30&requesttoken=` + token);
  }

  /** GET VPEC LIST **/
  getVPECList(){
    const token = sessionStorage.getItem('access_token');
    return this.http.post<any>(`${globals.endpoint}/mail/getattachmentsfolderid?requesttoken=` + token, '');
  }

  /** CREATE NEW TEXT FILE **/
  createNewTextFile(name){
    const token = sessionStorage.getItem('access_token');
    return this.http.post<any>(`${globals.endpoint}/newfile?requesttoken=` + token + '&filename=' + name , '');
  }

  /** CREATE SESSION NEW FILE **/
  createSession(fileid, path){
    const token = sessionStorage.getItem('access_token');
    return this.http.get<any>(`${globals.endpoint}/createsession?requesttoken=` + token + '&fileId=' + fileid + '&path=' + path);
  }

  /** CLOSE SESSION NEW FILE **/
  closeSession(fileid, path){
    const token = sessionStorage.getItem('access_token');
    return this.http.get<any>(`${globals.endpoint}/closesession?requesttoken=` + token + '&fileId=' + fileid + '&path=' + path);
  }

  /** CREATE NEW TEXT FILE **/
  pushNewFileText(data){
    const token = sessionStorage.getItem('access_token');
    return this.http.post<any>(`${globals.endpoint}/push?requesttoken=` + token , data);
  }

  /** ENCRYPT FILE **/
  encryptFile(fileid){
    const token = sessionStorage.getItem('access_token');
    return this.http.post<any>(`${globals.endpoint}/vencrypt/encrypt/file?requesttoken=` + token, {header: this.headers, driveFileId: fileid});
  }

  /** DECRYPT FILE **/
  decryptFile(fileid){
    const token = sessionStorage.getItem('access_token');
    return this.http.post<any>(`${globals.endpoint}/vencrypt/decrypt/file?requesttoken=` + token, {header: this.headers, driveFileId: fileid});
  }

  /** ENCRYPT FOLDER **/
  encryptFolder(fileid){
    const token = sessionStorage.getItem('access_token');
    return this.http.post<any>(`${globals.endpoint}/vencrypt/encrypt/folder?requesttoken=` + token, {header: this.headers, driveFolderId: fileid});
  }

  /** DECRYPT FOLDER **/
  decryptFolder(fileid){
    const token = sessionStorage.getItem('access_token');
    return this.http.post<any>(`${globals.endpoint}/vencrypt/decrypt/folder?requesttoken=` + token, {header: this.headers, driveFolderId: fileid});
  }

  listProtectedFiles(){
    const token = sessionStorage.getItem('access_token');
    return this.http.post<any>(`${globals.endpoint}/vencrypt/list/files?requesttoken=` + token, {});
  }

  /** VALIDATE SESSION **/
  validateSession(password){
    const token = sessionStorage.getItem('access_token');
    return this.http.post<any>(`${globals.endpoint}/vencrypt/validatesession?requesttoken=` + token, {password: password});
  }

  /** GET USER PERMISSION DATA **/
  getUserPermissionData(){
    const token = sessionStorage.getItem('access_token');
    return this.http.post<any>(`${globals.endpoint}/vencrypt/config/get?requesttoken=` + token, '');
  }

  /** SET USER PERMISSION DATA **/
  setUserPermissionData(){
    let datatest = {
      VencryptPassword:"test1234",
      SecurityPhrase:"test1234",
      Active: 1
    };
    const token = sessionStorage.getItem('access_token');
    return this.http.post<any>(`${globals.endpoint}/vencrypt/config/set?requesttoken=` + token, datatest);
  }

  /** GET BODY **/
  getBody(uri){
    const token = sessionStorage.getItem('access_token');
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.http.get<any>(`${globals.endpoint}/filebody?requesttoken=` + token + '&uri=' + uri,
                              { headers, observe: 'response', responseType: 'blob' as 'json'});
  }

  /** GET URL **/
  getUrl(data: any){
    //check if path need join
    let path = (data.homepath)? data.homepath : data.path;
    let name = (data.realname)? data.realname : data.name;
    return this.http.get(`${globals.endpoint}/getbodyfile?uri=`+ path + name + data.extension, {responseType: 'blob'});
  }

  /** FILE SYNC **/
  fileSync(data){
    const token = sessionStorage.getItem('access_token');
    return this.http.post<any>(`${globals.endpoint}/sync?requesttoken=` + token, data);
  }

  /** FILE FETCH **/
  fileFetch(documentId, sessionId, sessionToken){
    const token = sessionStorage.getItem('access_token');
    return this.http.get<any>(`${globals.endpoint}/text/session/fetch?requesttoken=` + token +'&documentId=' + documentId + 
                                                    '&sessionId=' + sessionId + '&sessionToken=' + sessionToken);
  }

   /** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ **/
  /** ~~~~~~~~~~~~ EXTERNAL LINK ~~~~~~~~~~~~ **/
 /** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ **/

  /** CONVERT LINK
   * Convert link from bridge to NC
   * 3.3.7.1 bridgeAPI
   * GET
   * @param url (string) url to convert
   **/
  convertLink(url){
    const token = sessionStorage.getItem('access_token');
    return this.http.get<any>(`${globals.endpoint}/convertlink?requesttoken=` + token + '&url=' + url);
  }

  /** GET PASSWORD LINK
   * Get password for link
   * 3.3.7.2 bridgeAPI
   * POST
   * @param token (string) url code base link
   * @param password (string) password for link
   **/
  getPasswordLink(token: string, password: string){
    let body = {password: password, sharingToken: token};
    return this.http.post<any>(`${globals.endpoint}/getpassword?token=` + token, body);
  }

  /** DATA FILE PUBLIC 
   * Used for getting data opened link
   * 3.1.22 bridgeAPI
   * GET
   * @param authorization (string) elaborated by link key
   * @param path (string)
   */
  dataFilePublic(path: string, authorization: string){
    const token = sessionStorage.getItem('access_token');
    return this.http.get<any>(`${globals.endpoint}/filespublic?path=` + path + '&authorization=' + authorization)
  }

  /** OPEN FOLDER PUBLIC 
   * Used to navigate a folder on external link
   * 3.1.22 bridgeAPI
   * GET
   * @param name (string) name of folder to navigate
   * @param authorization (string) elaborated by link key
   */
  openFolderPublic(name: string, authorization: string): Observable<any> {
    const token = sessionStorage.getItem('access_token');
    return this.http.get<any>(`${globals.endpoint}/filespublic?requesttoken=` + token + '&path=' + name + '&authorization=' + authorization);
  }

  /** DELETE FILE PUBLIC
   * Delete file/folder
   * 3.1.23 bridgeAPI
   * GET
   * @param uri (string) path of file/folder to delete
   * @param authorization (string) elaborated by link key
   */
  deleteFilesPublic(uri: any, authorization: string): Observable<any> {
    const token = sessionStorage.getItem('access_token');
    return this.http.get<any>(`${globals.endpoint}/deletepublic?requesttoken=` + token + `&uri=` + uri + '&authorization=' + authorization);
  }

  /** CREATE FOLDER PUBLIC 
   * Create new folder on link
   * 3.1.24 bridgeAPI
   * GET
   * @param folder (string) name of new folder
   * @param authorization (string) elaborated by link key
   */
  createFolderPublic(folder: string, authorization: string): Observable<any> {
    const token = sessionStorage.getItem('access_token');
    return this.http.get<any>(`${globals.endpoint}/createfolderpublic?requesttoken=` + token + `&folder=` + folder + '&authorization=' + authorization);
  }

  /** CREATE FILE PUBLIC 
   * Create new file on link
   * 3.1.25 bridgeAPI
   * GET
   * @param filename (string) name of new file
   * @param authorization (string) elaborated by link key
   */
  createFilePublic(filename: string, authorization: string): Observable<any> {
    const token = sessionStorage.getItem('access_token');
    return this.http.post<any>(`${globals.endpoint}/newfilepublic?requesttoken=` + token + `&filename=` + filename + '&authorization=' + authorization, '');
  }

  /** UPLOAD PUBLIC 
   * Create new file on link
   * 3.1.26 bridgeAPI
   * POST
   * @param uri (string) name of new file
   * @param authorization (string) elaborated by link key
   */
  uploadPublic(uri: string, authorization: string, file): Observable<any> {
    const fileAsBlob = new Blob([file]);
    return this.http.post<any>(`${globals.endpoint}/uploadpublic?uri=` + uri + '&authorization=' + authorization, fileAsBlob);
  }

  /** MOVE FILE PUBLIC 
   * Copy file/folder
   * 3.1.27 bridgeAPI
   * GET
   * @param source (string) start path of file/folder
   * @param destination (string) final path of file/folder 
   * @param authorization (string) elaborated by link key
   */
  moveFilePublic(source, destination, authorization: string): Observable<any> {
    const token = sessionStorage.getItem('access_token');
    return this.http.get<any>(`${globals.endpoint}/movepublic?source=` + source + '&destination=' + destination + '&authorization=' + authorization);
  }

  /** COPY FILE PUBLIC 
   * Copy file/folder
   * 3.1.28 bridgeAPI
   * GET
   * @param source (string) start path of file/folder
   * @param destination (string) final path of file/folder 
   * @param authorization (string) elaborated by link key
   */
  copyFilePublic(source, destination, authorization: string){
    const token = sessionStorage.getItem('access_token');
    return this.http.get<any>(`${globals.endpoint}/copypublic?source=`+ source +'&destination='+ destination +'&requesttoken=' + token + '&authorization=' + authorization);
  }

  /** DOWNLOAD FILE/FOLDER PUBLIC 
   * Download file/folder
   * 3.1.29 / 3.1.30 bridgeAPI
   * GET
   * @param dir (string) path of file/folder
   * @param files (any) names of file/folder
   * @param token (string) token of external link
   * @param authorization (string) elaborated by link key
   */
  downloadFilePublic(dir: string, files: any, token: string, issolo: boolean, password: string) {
    var download = document.createElement('a');
    if(issolo){
      var url = `${globals.endpoint}/download-public?` + '&saveAs=' + files + '&token=' + token + '&password=' + password + '&AddressIp=' + this.global.addressIp;
    }else{
      if(Array.isArray(files)){
        var url = `${globals.endpoint}/download-folder-public?` + '&files=[' + files + ']&dir=' + dir + '&saveAs=download&token=' + token + '&password=' + password + '&AddressIp=' + this.global.addressIp;
      }else if('extension' in files && files.extension.length>0){
        var url = `${globals.endpoint}/download-public?files=` + files.completeName + '&dir=' + dir + '&saveAs=' + files.completeName + '&token=' + token + '&password=' + password + '&AddressIp=' + this.global.addressIp;
      }else{
        var url = `${globals.endpoint}/download-folder-public?` + '&files=' + files.completeName + '&dir=' + dir + '&saveAs=' + files.completeName + '&token=' + token + '&password=' + password + '&AddressIp=' + this.global.addressIp;
      }
    }
    
    download.href = url;
    download.click();
    //@ts-ignore
    //$('.tableDiv').prepend('<img class="loader" src="/assets/img/loader.gif">');
    //TableComponent.isLoadingStatic = true;
    //TableComponent.spinnerStatic.show();
    
    checkDownload();
    function checkDownload() {
      setTimeout(function() {
        //@ts-ignore
        if (getCookie('downloadFinish') === "0") {
          checkDownload(); 
        } else {
          //@ts-ignore
          //$('.loader').remove();
          TableComponent.spinnerStatic.hide();
          TableComponent.isLoadingStatic = false;
        }
      }, 1000);
    }
  }

   /** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ **/
  /** ~~~~~~~~ GROUP FOLDER SETTINGS ~~~~~~~~ **/
 /** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ **/

  /** GET GROUP FOLDER GROUPS LIST
   * Get the list of all the groups
   * 6.17 bridgeAPI
   * GET
   **/
  getGroupfolderGroupsList() {
    const token = sessionStorage.getItem('access_token');
    return this.http.get<any>(`${globals.endpoint}/user/getgroupdetails?token`+ token);
  }

  /* GET GROUP FOLDER LIST
   * Get list of all group folder in settings
   * 8.29 bridgeAPI
   * GET
   */
  getGroupfolderList() {
    const token = sessionStorage.getItem('access_token');
    return this.http.get<any>(`${globals.endpoint}/setting/groupfolder/getfolder?token`+ token);
  }

  /* GET SINGLE GROUPFOLDER
   * Get list of single group folder in settings
   * 8.29.1 bridgeAPI
   * GET
   */
  getSingleGroupfolder(id) {
    return this.http.get<any>(`${globals.endpoint}/setting/groupfolder/getfolderid?idfolder=`+ id);
  }

  /** GET GROUP FOLDER SEARCH
   * ?????
   * 8.30 bridgeAPI
   * GET
   * @param id (number) id of searched element 
   **/
  getGroupfolderSearch(id: number) {
    const token = sessionStorage.getItem('access_token');
    return this.http.get<any>(`${globals.endpoint}/setting/groupfolder/getsearch?token`+ token + '&idfolder=' + id + '&search=');
  }

  /** GET GROUP FOLDER CREATE FOLDER
   * Create new group folder into settings
   * 8.31 bridgeAPI
   * POST
   * @param name (string) name of the new file
   **/
  getGroupfolderCreatefolder(name: string) {
    let usedname = {mountpoint: name}
    const token = sessionStorage.getItem('access_token');
    return this.http.post<any>(`${globals.endpoint}/setting/groupfolder/createfolder?token`+ token, usedname);
  }

  /** GET GROUP FOLDER ADD PERMISSIONS
   * Add new permissions to group
   * 8.32 bridgeAPI
   * POST
   * @param id (number) name of the new file
   * @param group (string) group to add permissions
   * @param permission (number) permissions id 
   **/
  getGroupfolderAddPermissions(id: number, group: string, permission: number) {
    const token = sessionStorage.getItem('access_token');
    let body = { "permissions": permission };
    return this.http.post<any>(`${globals.endpoint}/setting/groupfolder/addpermission?token`+ token + '&idfolder=' + id + '&group=' + group, body);
  }

  /** GET GROUP FOLDER ADD GROUP
   * Add new groups to folder
   * 8.33.1 bridgeAPI
   * POST
   * @param id (number) name of the new file
   * @param group (string) new group created
   **/
  getGroupfolderAddGroup(id: number, group: string) {
    const token = sessionStorage.getItem('access_token');
    let body =  { "group": group};
    return this.http.post<any>(`${globals.endpoint}/setting/groupfolder/addfolder?token`+ token + '&idfolder=' + id, body);
  }

  /** GET GROUP FOLDER REMOVE GROUP
   * Remove groups to folder
   * 8.33.2 bridgeAPI
   * GET
   * @param id (number) name of the new file
   * @param group (string) new group created
   **/
  getGroupfolderRemoveGroup(id: number, group: string) {
    const token = sessionStorage.getItem('access_token');
    return this.http.get<any>(`${globals.endpoint}/setting/groupfolder/deletegroupfolder?token`+ token + '&idfolder=' + id + '&group=' + group);
  }

  /** GET GROUP FOLDER ADD QUOTA
   * Create new group folder into settings
   * 8.33 bridgeAPI
   * POST
   * @param id (number) name of the new file
   * @param quota (number) limit of size
   **/
  getGroupfolderAddQuota(id: number, quota: number) {
    const token = sessionStorage.getItem('access_token');
    let body =  { "quota": quota};
    return this.http.post<any>(`${globals.endpoint}/setting/groupfolder/addquota?token`+ token + '&idfolder=' + id, body);
  }

  /** GET GROUP FOLDER ADD ACL
   * ???????
   * 8.34 bridgeAPI
   * POST
   * @param id (number) name of the new file
   * @param acl (number) number of boolean acl
   **/
  getGroupfolderAddAcl(id: number, acl: number) {
    const token = sessionStorage.getItem('access_token');
    let body =  {"acl": acl};
    return this.http.post<any>(`${globals.endpoint}/setting/groupfolder/addacl?token`+ token + '&idfolder=' + id, body);
  }

  /** GET GROUP FOLDER MANAGE ACL
   * ????????
   * 8.35 bridgeAPI
   * POST
   * @param id (number) name of the new file
   * @param groupType (string) response manage type
   * @param groupId (string) response manage id
   * @param acl (number) number of boolean acl
   **/
  getGroupfolderManageAcl(id: number, groupType: string, groupId: string, acl: number) {
    const token = sessionStorage.getItem('access_token');
    let body =  {
      "mappingType": groupType,
      "mappingId": groupId,
      "manageAcl": acl,
    };
    return this.http.post<any>(`${globals.endpoint}/setting/groupfolder/manageacl?token`+ token + '&idfolder=' + id, body);
  }

  /** GET GROUP FOLDER DELETE
   * Delete group folder into settings
   * 8.36 bridgeAPI
   * GET
   * @param id (number) id of the file
   **/
  getGroupfolderDelete(id: number) {
    const token = sessionStorage.getItem('access_token');
    return this.http.get<any>(`${globals.endpoint}/setting/groupfolder/deletefolder?token`+ token + '&idfolder=' + id);
  }

  /** GET GROUP FOLDER UPDATE NAME
   * Update only the name of a group folder
   * 8.37 bridgeAPI
   * POST
   * @param id (number) name of the new file
   * @param name (string) new group folder name
   **/
  getGroupfolderUpdatename(id: number, name: string) {
    const token = sessionStorage.getItem('access_token');
    let body =  { "mountpoint": name };
    return this.http.post<any>(`${globals.endpoint}/setting/groupfolder/updatefolder?token`+ token + '&idfolder=' + id, body);
  }

   /** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ **/
  /** ~~~~~~~~~~~~~ ONLY OFFICE ~~~~~~~~~~~~~ **/
 /** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ **/

  /** OPEN ONLY OFFICE
   * Get data of only office file (every kind)
   * 3.4.1 bridgeAPI
   * GET
   * @param id (string)
   * @param name (string) name and extension
   **/
  openOnlyOffice(id: string, name: string, token: string) {
    if(token.length>0) return this.http.get<any>(`${globals.endpoint}/config_onlyoffice?fileid=` + id + '&filepath=' + name + '&sharetoken=' + token);
    else return this.http.get<any>(`${globals.endpoint}/config_onlyoffice?fileid=` + id + '&filepath=' + name + '&shareToken=' + token);
  }

  /** CREATE ONLY OFFICE
   * Create only office file (every kind)
   * 3.4.2 bridgeAPI
   * POST
   * @param name (string) name and extension
   * @param path (string)
   **/
  createOnlyOffice(name: string, path: string, token: string){
    let body = {
      name: name,
      dir: path,
      shareToken: token,
    };
    return this.http.post<any>(`${globals.endpoint}/new_onlyoffice?`, body);
  }

  /** CREATE ONLY OFFICE
   * Create only office file (every kind)
   * 3.4.2.1 bridgeAPI
   * POST
   * @param name (string) name and extension
   * @param path (string)
   **/
   createOnlyOfficePassword(name: string, path: string, token: string, password: string){
    let body = {
      name: name,
      dir: path,
      shareToken: token,
    };
    return this.http.post<any>(`${globals.endpoint}/new_onlyoffice_password?password=` + password, body);
  }

   /** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ **/
  /** ~~~~~~~~~~ SETTINGS: STORAGE ~~~~~~~~~~ **/
 /** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ **/

  /** STORAGE LIST ALL
   * List all storages for settings
   * 8.20 bridgeAPI
   * GET
   **/
  storageListAll(){
    return this.http.get<any>(`${globals.endpoint}/setting/fileexternal/globalstoragegetall?`);
  }

  /** STORAGE LIST ALL
   * Test the storage status (0:active, 1:inactive, 2:missing info)
   * 8.20.2 bridgeAPI
   * GET
   * @param id (number)
   **/
  storageListOne(id:number){
    return this.http.get<any>(`${globals.endpoint}/setting/fileexternal/globalstorageget?storageid=` + id);
  }

  /** STORAGE CREATE
   * Create new storage
   * 8.21 bridgeAPI
   * POST
   **/
  storageCreate(body: any){
    return this.http.post<any>(`${globals.endpoint}/setting/fileexternal/globalstoragecreate?`, body);
  }

  /** STORAGE UPDATE CREDENTIAL 
   * Add or update global credential
   * 8.21.1 bridgeAPI
   * POST
   * @param user (string) username
   * @param password (string) 
   **/
  storageUpdateCredential(user: string, password: string){
    let body = {
      "uid": "",
      "user": user,
      "password": password
    };
    return this.http.post<any>(`${globals.endpoint}/setting/fileexternal/saveglobalcredentials?`, body);
  }

  /** STORAGE READ CREDENTIAL
   * Get global credential
   * 8.21.2 bridgeAPI
   * POST
   **/
  storageReadCredential(){
    return this.http.get<any>(`${globals.endpoint}/setting/fileexternal/getglobalcredential?`);
  }

  storageUpdate(id, body){
    return this.http.post<any>(`${globals.endpoint}/setting/fileexternal/globalstorageupdate?storageid=` + id, body);
    
  }

  /** STORAGE DELETE
   * Delete settings storage
   * 8.23 bridgeAPI+
   * 
   * GET
   * @param id (number)
   **/
  storageDelete(id: number){
    return this.http.delete<any>(`${globals.endpoint}/setting/fileexternal/globalstoragedelete?storageid=` + id);
  }

  /** STORAGE GET BACKEND
   * Get list all backend for storage create/update
   * 8.25 bridgeAPI
   * GET
   **/
  storageGetBackend(){
    return this.http.get<any>(`${globals.endpoint}/setting/fileexternal/getbackends?`);
  }

  /** STORAGE GET MECHANISM
   * Get list all authentication mechanisms for storage create/update
   * 8.26 bridgeAPI
   * GET
   **/
  storageGetMechanism(){
    return this.http.get<any>(`${globals.endpoint}/setting/fileexternal/getmechanisms?`);
  }

  /** USER SEARCH GROUPS
   * Get all groups
   * 6.16 bridgeAPI
   * GET
   */
  userGetGroups() {
    return this.http.get<any>(`${globals.endpoint}/user/getgroups?`);
  }


  /** GET CONFIGURED MAILS **/
  getConfiguredMails(){
    return this.http.post<any>(`${globals.endpoint}/mail/account/get?`, {});
  }

  /** ADD TAGS SIGNED FILES **/
  tagSignedFiles(id: number){
    return this.http.post<any>(`${globals.endpoint}/signature/dds/tagfile?`, {'fileId': id});
  }

  trackFileUpdate(path: string): Observable<any> {
    return this.http.post<any>(`${globals.endpoint}/vdeskintegration/logcollectorupdate`, { path } );
  }

}