import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from 'src/config/globals';

@Injectable({
  providedIn: 'root'
})
export class VshareSettingsService {

  constructor(private http: HttpClient) { }

  /**
   * Get group folder by access token
   */
  getGroupFolder(): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/setting/groupfolder/getfolder`);
  }

  /**
   * Create a new group folder by form data and access token
   * @param form
   */
  createGroupFolder(form: any): Observable<any> {
    return this.http.post<any>(`${globals.endpoint}/setting/groupfolder/createfolder`, form);
  }

  /**
   * Add a group to a group folder by folder id, form data and access token
   * @param id
   * @param data
   */
  addGroup(id: any, data: any): Observable<any> {
    return this.http.post<any>(`${globals.endpoint}/setting/groupfolder/addfolder?idfolder=` + id, data);
  }

  /**
   * Add a quota to a group folder by folder id, form data and access token
   * @param id
   * @param data
   */
  addQuota(id: any, data: any): Observable<any> {
    return this.http.post<any>(`${globals.endpoint}/setting/groupfolder/addquota?idfolder=` + id, data);
  }

  /**
   * Add permissions to a group folder by folder id, form data and access token
   * @param id
   * @param data
   */
  addPermissions(id: any, data: any): Observable<any> {
    return this.http.post<any>(`${globals.endpoint}/setting/groupfolder/addacl?idfolder=` + id, data);
  }

  /**
   * Update permissions to a group folder by folder id, form data and access token
   * @param id
   * @param data
   */
  managePermissions(id: any, data: any): Observable<any> {
    return this.http.post<any>(`${globals.endpoint}/setting/groupfolder/manageacl?idfolder=` + id, data);
  }
}
