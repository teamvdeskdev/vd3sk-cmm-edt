import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PostItDto } from 'src/app/app-model/dashboard/CreateUpdatePostItResponse';

@Injectable({
  providedIn: 'root'
})
export class RemindersPageService {
  activeFilterInputValue = null;
  completedFilterInputValue = null;
  activePostItsCache: PostItDto[] = null;
  completedPostItsCache: PostItDto[] = null;
  resetFilter = new BehaviorSubject<boolean>(null);

  constructor() { }

  setActivePreviousFilterInputValue(value: any) {
    this.activeFilterInputValue = value;
  }

  getActivePreviousFilterInputValue() {
    return this.activeFilterInputValue;
  }

  setCompletedPreviousFilterInputValue(value: any) {
    this.completedFilterInputValue = value;
  }

  getCompletedPreviousFilterInputValue() {
    return this.completedFilterInputValue;
  }

  setActivePostItsCache(value: PostItDto[]) {
    this.activePostItsCache = value;
  }

  getActivePostItsCache() {
    return this.activePostItsCache;
  }

  setCompletedPostItsCache(value: PostItDto[]) {
    this.completedPostItsCache = value;
  }

  getCompletedPostItsCache() {
    return this.completedPostItsCache;
  }
}
