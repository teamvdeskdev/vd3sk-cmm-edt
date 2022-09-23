import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from 'src/config/globals';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  constructor(private http: HttpClient) {}

  /**
   * Get all activities by session token
   */
  getAllActivities(id: any): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/activity/all?since=` + id);
  }

  getYourActivities(id: any): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/activity/byyou?since=` + id);
  }

  getOthersActivities(id: any): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/activity/byothers?since=` + id);
  }

  getActivFavorites(id: any): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/activity/favorities?since=` + id);
  }

  getActivFileChanges(id: any): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/activity/filechanges?since=` + id);
  }

  getActivSecurity(id: any): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/activity/security?since=` + id);
  }

  getActivFileShares(id: any): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/activity/fileshares?since=` + id);
  }

  getActivCalendar(id: any): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/activity/calendar?since=` + id);
  }

  getActivTask(id: any): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/activity/todos?since=` + id);
  }

}

