import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { globals } from 'src/config/globals';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  /**
   * Get the user groups by user identifier and access token
   */
  getUserGroups(userid: any): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/user/usersgroup?userid=` + userid);
  }

}
