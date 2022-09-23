import { Injectable } from '@angular/core';
import { CacheCardModel } from '../app-model/dashboard/CacheCardModel';
import { CacheHeaderModel } from '../app-model/dashboard/CacheHeaderModel';
import { PostItDto } from '../app-model/dashboard/CreateUpdatePostItResponse';
import { FeedModel } from '../app-model/dashboard/FeedModel';
import { ListFeedersResponse } from '../app-model/dashboard/ListFeedersReasponse';
import { UserDashboardModel } from '../app-model/dashboard/UserDashboardModel';

@Injectable({
  providedIn: 'root'
})
export class DashboardCacheService {
  model: CacheCardModel;
  modelHeader: CacheHeaderModel;
  userDashboardModel: UserDashboardModel;
  feedsModel: FeedModel[];
  postItModel: PostItDto[];
  listFeedersResponse: ListFeedersResponse;

  constructor() { }

  setCacheCardModel(cardModel: CacheCardModel) {
    this.model = cardModel;
  }

  getCacheCardModel() {
    return this.model;
  }

  setCacheHeaderModel(headerModel: CacheHeaderModel) {
    this.modelHeader = headerModel;
  }

  getCacheHeaderModel() {
    return this.modelHeader;
  }

  setUserDashboardModel(model: UserDashboardModel) {
    this.userDashboardModel = model;
  }

  getUserDashboardModel() {
    return this.userDashboardModel;
  }

  setCacheFeedModel(data: FeedModel[]) {
    this.feedsModel = data;
  }

  getCacheFeedModel() {
    return this.feedsModel;
  }

  setCachePostItModel(data: PostItDto[]) {
    this.postItModel = data;
  }

  getCachePostItModel() {
    return this.postItModel;
  }

  setFeedersResponse(data: ListFeedersResponse) {
    this.listFeedersResponse = data;
  }

  getFeedersResponse() {
    return this.listFeedersResponse;
  }
}
