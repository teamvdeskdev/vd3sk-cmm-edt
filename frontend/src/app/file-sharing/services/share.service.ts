import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { globals } from 'src/config/globals';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  //headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');

  constructor(private http: HttpClient) { }

  /**
   * Get File to share by file id and session token
   * @param fileId
   */
  getFile(fileId: any): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/getfile?fileid=` + fileId);
  }

  /**
   * Get the users who share the file with me by file path and session token
   * @param filePath
   */
  filesSharedWithMe(filePath: any): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/filessharedwithme?path=` + filePath);
  }

  /**
   * Get the file shares status by file path and session token
   * @param filePath
   */
  reshares(filePath: any): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/filesreshares?path=` + filePath);
  }

  /**
   * Get the resource file by file id and session token
   * @param fileId
   */
  getResourceFile(fileId: any): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/getresourcefile?fileid=` + fileId);
  }

  getUserPermission(data): Observable<any> {
    return this.http.post<any>(`${globals.endpoint}/vdesk_tim/getusersharepermissions` , data);
  }

  /**
   * Get users for share by search string and session token
   * @param searchString
   */
  searchUserForShare(searchString: any): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/sharedsearch?search=` + searchString)
    .pipe(
      debounceTime(500),  // WAIT FOR 500 MILISECONDS AFTER EACH KEY STROKE
      map((data: any) => (data)
    ));
  }

  searchUserForShareComponent(searchString: any, nodeId: any): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/sharedsearch?search=` + searchString + `&nodeId=` + nodeId)
     .pipe(
       debounceTime(500),  // WAIT FOR 500 MILISECONDS AFTER EACH KEY STROKE
       map((data: any) => (data)
     ));
   }

  /**
   * Insert a file/folder share or a link share by data and session token
   * @param data
   */
  insertShare(data: any): Observable<any> {
    return this.http.post<any>(`${globals.endpoint}/shares`, data);
  }

  /**
   * Update the share by id and session token
   * @param id
   * @param data
   */
  updateShare(id: any, data: any): Observable<any> {
    return this.http.post<any>(`${globals.endpoint}/updateshare?id=` + id, data);
  }

  /**
   * Delete the share by id and session token
   * @param id
   */
  deleteShare(id: any): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/deleteshare?id=` + id);
  }

  /**
   * Get Sharing list
   * @param fileName
   */
  getShareActivityPfd(fileName: string): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/exportshares?path=` + fileName);
  }

  closeProject(path: string, expiration: string) {
    return this.http.get<any>(`${globals.endpoint}/closeproject?path=` + path +  `&expire_date=` + expiration);
  }

  findCloseDate(path: string){
    return this.http.get<any>(`${globals.endpoint}/finddatecloseproject?path=` + path);
  }
}
