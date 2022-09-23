import { Injectable } from '@angular/core';
import { Observable, throwError, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { globals } from 'src/config/globals';

@Injectable({
  providedIn: 'root'
})
export class SearchbarService {

  // Observable sources
  private labelClickedSource = new Subject<any>();
  private labelsSubmittedSource = new Subject<any>();
  //private searchSubmittedSource = new Subject<any>();

  constructor(private http: HttpClient) {}

  // Observable streams
  labelClicked$ = this.labelClickedSource.asObservable();
  labelsSubmitted$ = this.labelsSubmittedSource.asObservable();
  //searchSubmitted$ = this.searchSubmittedSource.asObservable();

  // Service message commands
  onLabelsSelection(data) {
    this.labelClickedSource.next(data);
  }

  onLabelsSubmit(data) {
    this.labelsSubmittedSource.next(data);
  }

  /*
  onSearchSubmit(data) {
    this.searchSubmittedSource.next(data);
  }
  */

  /** GET LIST LABELS **/
  getListLabels() {
    return this.http.get<any>(`${globals.endpoint}/listtags`);
  }
}
