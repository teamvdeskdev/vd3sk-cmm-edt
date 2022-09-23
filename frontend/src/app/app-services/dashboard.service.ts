import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { globals } from 'src/config/globals';
import { CardEmailCountsResponse } from '../app-model/dashboard/CardEmailCountsResponse';
import { AppsListModel } from '../app-model/vcanvas/AppsListModel';
import { UserDashboardConfig } from '../app-model/dashboard/UserDashboardConfigResponse';
import { UserDashboardModel } from '../app-model/dashboard/UserDashboardModel';
import { OrderModule } from '../app-pages/dashboard/draggable-card/draggable-card.component';
import { ListFeedersResponse } from '../app-model/dashboard/ListFeedersReasponse';
import { LoadFeedsRequest } from '../app-model/dashboard/LoadFeedsRequest';
import { LoadFeedsResponse } from '../app-model/dashboard/LoadFeedsResponse';
import { CreateUpdatePostItRequest } from '../app-model/dashboard/CreateUpdatePostItRequest';
import { CreateUpdatePostItResponse, PostItDto } from '../app-model/dashboard/CreateUpdatePostItResponse';
import { LoadPostItRequest } from '../app-model/dashboard/LoadPostItRequest';
import { LoadPostItResponse } from '../app-model/dashboard/LoadPostItResponse';
import { SharePostItRequest } from '../app-model/dashboard/SharePostItRequest';
import { SharePostItResponse } from '../app-model/dashboard/SharePostItResponse';
import { NgxSpinnerService } from 'ngx-spinner';
import { DeletePostItResponse } from '../app-model/dashboard/DeletePostItResponse';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  loadingTimer: any;
  loading = false;
  httpOptions: any;
  showHeader = new BehaviorSubject<boolean>(true);
  newsOrderModule = new BehaviorSubject<OrderModule>(null);
  showNewsAndReminders = new BehaviorSubject<boolean>(true);
  clickPostItDone = new BehaviorSubject<PostItDto>(null);
  availableCards: string[];
  isSavingFeeders = false;
  isSavingPostIts = false;

  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService
    ) {
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    this.availableCards = ['VMeet', 'VPec', 'VCal', 'VShare', 'VCanvas', 'VFlow'];
  }

  startLoading() {
    this.spinner.show();
    this.loading = true;
    this.loadingTimer = setTimeout(() => {
        if (this.loading) {
            this.stopLoading();
        }
    }, 1200000);
  }

  stopLoading() {
    this.spinner.hide();
    this.loading = false;
    clearTimeout(this.loadingTimer);
  }

  /**
   * Get the vMeet rooms
   */
  getMyMeetingList(userID: string, tokenVMeet: string): Observable<any> {
    const url = `${globals.vMeetEndpoint}/getMyMeetingList`;
    return this.http.get<any>(url + '?userID=' + userID + '&jwt=' + tokenVMeet);
  }
  /**
   * Get the profile picture for current user
   */
  getAvatar(sizeParam: number): Observable<Blob> {
    const url = `${globals.endpoint}/setting/info/avatar/currentavatar?size=` + sizeParam + `&` + new Date().getTime();
    return this.http.get(url, { responseType: 'blob' });
  }

  /**
   * Get storage space
   */
  getStorageSpace(): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/getstoragestat?dir=`);
  }

  getProfilePic(user: string, size: number): Observable<Blob> {
    const url = `${globals.endpoint}/setting/info/avatar/getavatar?user=` + user + `&size=` + size;
    return this.http.get(url, { responseType: 'blob' });
  }

  /**
   * Get others activities for vShare activities card
   * @param id
   */
  getOthersActivities(id: any): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/activity/byothers?since=` + id);
  }

  /**
   * Get favorites list for vShare favorites card
   */
  getListFavorites(): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/favorites`);
  }

  /**
   * Get the VPEC account list for the current user
   */
  getAccountList() {
    return this.http.post<any>(`${globals.vpecEndpoint}/account/get`, this.httpOptions);
  }

  /**
   * Get the signature by accountId
   */
  getSignature(id: number): Observable<any> {
    const body = { accountId: id};
    return this.http.post<any>(`${globals.vpecEndpoint}/signature/get`, body, this.httpOptions);
  }

  /**
   * Get the mail folders list
   */
  getFolderList(id: number) {
    const body = { accountId: id };
    return this.http.post<any>(`${globals.vpecEndpoint}/folder/get`, body, this.httpOptions);
  }

  /**
   * Get the message list for a specific folder
   * @param pageType is the page type
   * @param folder is the email folder object
   * @param lastMessageId is the id of the last message displayed
   */
  getMessageList(pageType: string, folder: any, lastMessageId: any, messagePrevNr: any): Observable<any> {
    const accountIdVPEC = parseInt(sessionStorage.getItem('VPEC_currentId'), 10);

    if (!globals.isDev) {
      const folderName = folder.folderFullName;
      const folderNameBase64 = folder.folderFullNameBase64;

      const body = this.getBodyRequest(accountIdVPEC, 'LOAD', folderName, folderNameBase64, 0, lastMessageId, messagePrevNr);
      return this.http.post<any>(`${globals.vpecEndpoint}/get`, body, this.httpOptions);
    }
  }

  getBodyRequest(accountId, request, folderName, typeBase64, uid, lastMessageId, messagePrevNr) {
    let filter;
    let customParams;

    if (request === 'LOAD') { // Messages list REQUEST
      if (lastMessageId === null) {
        filter = {
          limit: 3
        };
      } else {
        filter = {};
      }

      if (lastMessageId !== null) {
        filter.messageId = lastMessageId;
        filter.messagePrevNumber = messagePrevNr;
      }

      filter.folderName = typeBase64;
    }

    return {
      request,
      accountId,
      filter,
      customParams
    };
  }

  /**
   * Decode Base64 string into UTF8 format
   * @param str is the Base64 string to decode in UTF8 format
   */
  b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }


  /** **/
  getUserApps(): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/app/list`);
  }

  /**
   * Get the user calendar list
   */
  getCalendarList(): Observable<any> {
    return this.http.post<any>(`${globals.vcalEndpoint}/calendar/get`, {});
  }

  /**
   * Get the calendar events
   */
  getCalendarEvents(data): Observable<any> {
    return this.http.post<any>(`${globals.vcalEndpoint}/event/get`, data);
  }

  getAppsList(): Observable<AppsListModel> {
    return this.http.get<AppsListModel>(`${globals.vCanvasEndpoint}/appslist`);
  }

  getFormattedAppsList(apiAppsList): any[] {
    const appsLists: any[] = [];

    const len = apiAppsList.length;
    if (len > 6) {
      for (let i = 0; i < 6; i++) {
        const src = (!!apiAppsList[i].IconData) ?
          'data:image/svg+xml;base64,' + apiAppsList[i].IconData :
          '/assets/img/icons/fallback-icon.svg';
        appsLists.push({ id: apiAppsList[i].Id, src: src, name: apiAppsList[i].Name });
      }

    } else {
      for (let i = 0; i < len; i++) {
        const src = (!!apiAppsList[i].IconData) ?
          'data:image/svg+xml;base64,' + apiAppsList[i].IconData :
          '/assets/img/icons/fallback-icon.svg';
        appsLists.push({ id: apiAppsList[i].Id, src: src, name: apiAppsList[i].Name });
      }
    }

    return appsLists;
  }

  //#region VFLOW
  public async vFlowAsyncPost<TModel>(controller: string, action: string, request: TModel) {
    const response = await this.http.post<TModel>(`${globals.vFlowEndpoint}`
      + '/' + controller + '/' + action, request, this.httpOptions).toPromise();
    return response;
  }
  

  ////#endregion FLOW

  setShowHeader(value: boolean) {
    this.showHeader.next(value);
  }

  getEmailCardCounts(): Observable<CardEmailCountsResponse> {
    return this.http.post<CardEmailCountsResponse>(`${globals.endpoint}/mail/card/getcounts`, null);
  }

  /*
  getAvailableCards(): string[] {
    return this.availableCards;
  }
  */

  getAvailableCards(userApps: string[]): string[] {
    if (userApps.length === 0) {
      return this.availableCards;
    } else {
      let userCards: string[] = [];
      userApps.forEach(app => {
        this.availableCards.forEach(card => {
          if (app === card.toUpperCase()) {
            userCards.push(card);
          }
        });
      });
      return userCards;
    }    
  }

  getUserDashboardConfig(): Observable<UserDashboardConfig> {
    return this.http.post<UserDashboardConfig>(`${globals.endpoint}/vdeskintegration/dashboard/getconfig`, null);
  }

  setUserDashboardConfig(userConfigModel: UserDashboardModel): Observable<UserDashboardConfig> {
    const body = {configData: userConfigModel};
    return this.http.post<UserDashboardConfig>(`${globals.endpoint}/vdeskintegration/dashboard/setconfig`, body);
  }

  addUpdateFeeder(descriptionParam: string, urlParam: string, idParam?: number): Observable<any> {
    const body = {description: descriptionParam, url: urlParam, id: idParam};
    return this.http.post<any>(`${globals.endpoint}/vdeskintegration/rss/addfeeder`, body);
  }

  deleteFeeder(idParam: number): Observable<any> {
    const body = {id: idParam};
    return this.http.post<any>(`${globals.endpoint}/vdeskintegration/rss/deletefeeder`, body);
  }

  loadFeeds(requestModel: LoadFeedsRequest): Observable<LoadFeedsResponse> {
    const body = requestModel;
    return this.http.post<LoadFeedsResponse>(`${globals.endpoint}/vdeskintegration/rss/loadfeeds`, body);
  }

  getListFeeders(): Observable<ListFeedersResponse> {
    return this.http.post<ListFeedersResponse>(`${globals.endpoint}/vdeskintegration/rss/listfeeders`, null);
  }

  createOrUpdatePostIt(data: CreateUpdatePostItRequest): Observable<CreateUpdatePostItResponse> {
    return this.http.post<CreateUpdatePostItResponse>(`${globals.endpoint}/vdeskintegration/todo/createorupdate`, data);
  }

  setCompletedPostIt(idParam: number) {
    const data = {id: idParam};
    return this.http.post<CreateUpdatePostItResponse>(`${globals.endpoint}/vdeskintegration/todo/setcompleted`, data);
  }

  loadPostIt(data: LoadPostItRequest): Observable<LoadPostItResponse> {
    if (!data.filters) {
      const filters = {
        from: -8640000000000000,
        to: 8640000000000000,
      };
      data.filters = filters;
    }
    return this.http.post<LoadPostItResponse>(`${globals.endpoint}/vdeskintegration/todo/load`, data);
  }

  sharePostIt(data: SharePostItRequest): Observable<SharePostItResponse> {
    return this.http.post<SharePostItResponse>(`${globals.endpoint}/vdeskintegration/todo/share`, data);
  }

  deletePostIt(postItId: number): Observable<DeletePostItResponse> {
    const body = {
      id: postItId
    };
    return this.http.post<DeletePostItResponse>(`${globals.endpoint}/vdeskintegration/todo/delete`, body);
  }
}
