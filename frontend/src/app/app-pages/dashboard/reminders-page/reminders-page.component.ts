import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, Subscription } from 'rxjs';
import { CreateUpdatePostItRequest } from 'src/app/app-model/dashboard/CreateUpdatePostItRequest';
import { PostItDto } from 'src/app/app-model/dashboard/CreateUpdatePostItResponse';
import { LoadPostItRequest } from 'src/app/app-model/dashboard/LoadPostItRequest';
import { SharePostItRequest } from 'src/app/app-model/dashboard/SharePostItRequest';
import { DashboardCacheService } from 'src/app/app-services/dashboard-cache.service';
import { DashboardService } from 'src/app/app-services/dashboard.service';
import { LanguageService } from 'src/app/app-services/language.service';
import { AuthenticationService } from 'src/app/app-shared/authentication.service';
import { AddPostItDialogComponent } from '../news-and-reminders/add-post-it-dialog/add-post-it-dialog.component';
// tslint:disable-next-line: max-line-length
import { NewsRemindersCustomSnackbarComponent } from '../news-and-reminders/news-reminders-custom-snackbar/news-reminders-custom-snackbar.component';
import { FilterPostItDialogComponent } from './filter-post-it-dialog/filter-post-it-dialog.component';
import { RemindersPageService } from './reminders-page.service';

@Component({
  selector: 'app-reminders-page',
  templateUrl: './reminders-page.component.html',
  styleUrls: ['./reminders-page.component.scss']
})
export class RemindersPageComponent implements OnInit, OnDestroy {

  loadingTimer: any;
  loading = false;
  firstLoading = false;
  allPostIts: PostItDto[];
  activePostIts: PostItDto[];
  completedPostIts: PostItDto[];
  searchTextCompleted: string;
  searchTextActive: string;
  emptyActivePostItsView: any[];
  emptyCompletedPostItsView: any[];
  postItDoneSub: Subscription;
  activePostItsFiltersCounter = 0;
  completesPostItsFiltersCounter = 0;

  constructor(
    public langService: LanguageService,
    private dashService: DashboardService,
    private dialog: MatDialog,
    private dashboardCacheService: DashboardCacheService,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private authService: AuthenticationService,
    private remindersPageService: RemindersPageService,
    private router: Router
  ) { }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.emptyActivePostItsView = this.calculateEmptyPostIt(this.activePostIts, event.target.innerWidth, true);
    this.emptyCompletedPostItsView = this.calculateEmptyPostIt(this.completedPostIts, event.target.innerWidth, false);
  }

  ngOnInit(): void {
    this.startLoading();
    this.firstLoading = true;
    this.loadAllPostIts().subscribe(resp => {
      this.allPostIts = resp;
      if (this.allPostIts) {
        this.activePostIts = this.allPostIts.filter(p => !p.completed);
        this.completedPostIts = this.allPostIts.filter(p => p.completed);
        this.emptyActivePostItsView = this.calculateEmptyPostIt(this.activePostIts, window.innerWidth, true);
        this.emptyCompletedPostItsView = this.calculateEmptyPostIt(this.completedPostIts, window.innerWidth, false);
        this.remindersPageService.setActivePostItsCache(this.activePostIts);
        this.remindersPageService.setCompletedPostItsCache(this.completedPostIts);
      } else {
        this.emptyActivePostItsView = this.calculateEmptyPostIt(this.activePostIts, window.innerWidth, true);
        this.emptyCompletedPostItsView = this.calculateEmptyPostIt(this.completedPostIts, window.innerWidth, false);
      }
      this.firstLoading = false;
      this.stopLoading();
    });
    // click done on post-it
    this.postItDoneSub = this.dashService.clickPostItDone.subscribe(resultPostIt => {
      if (resultPostIt) {
        const message = '<span>' +
          this.langService.dictionary.successDonePostItMsg1 +
          ' <b>' + resultPostIt.title + '</b> ' +
          this.langService.dictionary.successDonePostItMsg2 +
          '</span>';
        this.openCustomNewsRemindersSnackbar(message);
        this.refreshPostItData(false);
        // reset filter
        this.remindersPageService.resetFilter.next(true);
        this.activePostItsFiltersCounter = 0;
      }
    });
  }

  loadAllPostIts() {
    const result = new Subject<PostItDto[]>();
    const loadPostItReq: LoadPostItRequest = {
      skip: 0,
      take: 1000
    };
    this.dashService.loadPostIt(loadPostItReq).subscribe(resp => {
      if (resp && resp.Performed && resp.Dto && resp.Dto.length > 0) {
        const postIts = resp.Dto;
        postIts.sort(function (x, y) {
          return y.createdAt - x.createdAt;
        });
        result.next(postIts);
      } else {
        result.next(null);
      }
    });
    return result.asObservable();
  }

  calculateEmptyPostIt(postItData: PostItDto[], browserWindowWidth: number, haveAddPostItBtn: boolean) {
    const paddingPostItArea = 20; // padding-right di "news-and-reminders-container"
    const postItWidth = 229; // 211px (width) + 18px (margin-right)
    const numberOfRow = 3;
    const numbeOfPostItPerRow = Math.floor((browserWindowWidth - paddingPostItArea) / postItWidth);
    const addPostItBtn = haveAddPostItBtn ? 1 : 0;
    let emptyPostItToShow = [];
    // empty post-it
    let numberOfEmptyPostIt = 0;

    if (postItData && (postItData.length < (numbeOfPostItPerRow * numberOfRow) - addPostItBtn)) {
      numberOfEmptyPostIt = (numbeOfPostItPerRow * numberOfRow) - (postItData.length + addPostItBtn);
    } else if (!postItData || postItData && postItData.length === 0) {
      numberOfEmptyPostIt = (numbeOfPostItPerRow * numberOfRow) - addPostItBtn;
    }
    if (numberOfEmptyPostIt > 0) {
      emptyPostItToShow = new Array(numberOfEmptyPostIt).fill('empty');
    } else {
      emptyPostItToShow = [];
    }
    return emptyPostItToShow;
  }

  openAddPostItDialog() {
    this.dashService.isSavingPostIts = true;
    // reset filter
    this.remindersPageService.resetFilter.next(true);
    this.activePostItsFiltersCounter = 0;
    // open dialog
    const dialogRef = this.dialog.open(AddPostItDialogComponent, {
      minWidth: '780px',
      data: {},
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'Confirm' && result.value) {
        this.startLoading();
        const sharedUser = result.value.shareInput && result.value.shareInput.length > 0 ? result.value.shareInput[0] : '';
        let body = result.value.description;
        const createModel: CreateUpdatePostItRequest = {
          title: result.value.title,
          body: body.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
          completed: false
        };
        this.dashService.createOrUpdatePostIt(createModel).subscribe(respCreate => {
          if (respCreate && respCreate.Performed && respCreate.Dto) {
            if (sharedUser) {
              const shareModel: SharePostItRequest = {
                shareType: 'user',
                target: sharedUser, // da sostituire con la lista degli utenti quando sarà modificato il BE
                todoId: respCreate.Dto.id
              };
              this.dashService.sharePostIt(shareModel).subscribe(respShare => {
                this.refreshPostItData(true, respCreate.Dto.title);
              });
            } else {
              this.refreshPostItData(true, respCreate.Dto.title);
            }
          } else {
            this.dashService.isSavingPostIts = false;
            this.stopLoading();
          }
        });
      } else {
        this.dashService.isSavingPostIts = false;
      }
    });
  }

  refreshPostItData(callFromCreate: boolean, postItTitle?: string) {
    const loadPostItReq: LoadPostItRequest = {
      skip: 0,
      take: 1000
    };
    this.dashService.loadPostIt(loadPostItReq).subscribe(resp => {
      if (resp.Performed && resp.Dto && resp.Dto.length > 0) {
        const notCompletedPostIt = resp.Dto.filter(p => !p.completed);
        const completedPostIts = resp.Dto.filter(p => p.completed);
        notCompletedPostIt.sort(function (x, y) {
          return y.createdAt - x.createdAt;
        });
        this.activePostIts = notCompletedPostIt;
        this.completedPostIts = completedPostIts;
        this.dashboardCacheService.setCachePostItModel(this.activePostIts);
        this.emptyActivePostItsView = this.calculateEmptyPostIt(this.activePostIts, window.innerWidth, true);
        this.emptyCompletedPostItsView = this.calculateEmptyPostIt(this.completedPostIts, window.innerWidth, false);
        this.remindersPageService.setActivePostItsCache(this.activePostIts);
        this.remindersPageService.setCompletedPostItsCache(this.completedPostIts);
        if (callFromCreate) {
          const message = '<span>' +
            this.langService.dictionary.successCreatePostItMsg1 +
            ' <b>' + postItTitle + '</b> ' +
            this.langService.dictionary.successCreatePostItMsg2 +
            '</span>';
          this.openCustomNewsRemindersSnackbar(message);
        }
      }
      this.dashService.isSavingPostIts = false;
      this.stopLoading();
    });
  }

  openCustomNewsRemindersSnackbar(message: string) {
    this.snackBar.openFromComponent(NewsRemindersCustomSnackbarComponent, {
      data: message,
      duration: 5000,
      panelClass: 'news-reminders-snackbar'
    });
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

  keyupSearchActive(searchText: string) {
    const cachedPostIt = this.remindersPageService.getActivePostItsCache();
    if (cachedPostIt && searchText && searchText !== '') {
      this.activePostIts = cachedPostIt.filter(i => i.title.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) ||
        i.body.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()));
    } else {
      this.activePostIts = cachedPostIt;
    }
    this.emptyActivePostItsView = this.calculateEmptyPostIt(this.activePostIts, window.innerWidth, true);
  }

  keyupSearchCompleted(searchText: string) {
    const cachedPostIt = this.remindersPageService.getCompletedPostItsCache();
    if (cachedPostIt && searchText && searchText !== '') {
      this.completedPostIts = cachedPostIt.filter(i => i.title.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) ||
        i.body.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()));
    } else {
      this.completedPostIts = cachedPostIt;
    }
    this.emptyCompletedPostItsView = this.calculateEmptyPostIt(this.completedPostIts, window.innerWidth, false);
  }

  openFilterPostItDialog(isActivePostItFilter: boolean) {
    // tslint:disable-next-line: max-line-length
    const postIts = isActivePostItFilter ? this.remindersPageService.getActivePostItsCache() : this.remindersPageService.getCompletedPostItsCache();
    if (postIts && postIts.length > 0) {
      const users = this.usersAssociatedPostIt(postIts);
      // tslint:disable-next-line: max-line-length
      const prevFilterData = isActivePostItFilter ? this.remindersPageService.getActivePreviousFilterInputValue() : this.remindersPageService.getCompletedPreviousFilterInputValue();
      const dialogRef = this.dialog.open(FilterPostItDialogComponent, {
        minWidth: '780px',
        data: {
          associatedUsers: users,
          previousFilterData: prevFilterData
        },
        autoFocus: false
      });
      dialogRef.afterClosed().subscribe(result => {
        // FILTER BUTTON ACTION
        if (result && result.data && result.data.value && result.buttonType === 'filter') {
          const filterData = result.data.value;
          // apply filters on cached post-its
          let filteredPostIt = postIts;
          const startDate = filterData.startDateControl ? new Date(filterData.startDateControl) : null;
          const endDate = filterData.endDateControl ? new Date(filterData.endDateControl) : null;
          const associatedUsers = filterData.associatedUsersControl;
          const personalPostIt = filterData.personalRemindersCheck;
          const sharedPostIt = filterData.sharedRemindersCheck;
          // time range filter
          if (startDate && endDate) {
            filteredPostIt = filteredPostIt.filter(p =>
              (this.convertTimestampToDate(p.createdAt) >= startDate && this.convertTimestampToDate(p.createdAt) <= endDate)
            );
          }
          // associated user filter
          if (associatedUsers && associatedUsers.length > 0) {
            filteredPostIt = filteredPostIt.filter(p => {
              // associated user in shares
              if (p.shares && p.shares.length > 0) {
                return p.shares.filter(shares => {
                  associatedUsers.forEach(userFilter => {
                    if (shares.sharedWith === userFilter) {
                      return p;
                    }
                  });
                });
              }
              // associated user as owner
              if (p.userId !== this.authService.currentUser.id && associatedUsers.includes(p.userId)) {
                return p;
              }
            });
          }
          // checkbox owner/shared filter
          if (personalPostIt && !sharedPostIt) {
            filteredPostIt = filteredPostIt.filter(p => p.userId === this.authService.currentUser.id);
          }
          if (!personalPostIt && sharedPostIt) {
            filteredPostIt = filteredPostIt.filter(p => p.userId !== this.authService.currentUser.id);
          }
          // ASSIGN RESULT FILTERS
          if (isActivePostItFilter) {
            this.remindersPageService.setActivePreviousFilterInputValue(filterData);
            this.activePostIts = filteredPostIt;
            this.activePostItsFiltersCounter = result.counterAppliedFilters;
            this.emptyActivePostItsView = this.calculateEmptyPostIt(this.activePostIts, window.innerWidth, true);
          } else {
            this.remindersPageService.setCompletedPreviousFilterInputValue(filterData);
            this.completedPostIts = filteredPostIt;
            this.completesPostItsFiltersCounter = result.counterAppliedFilters;
            this.emptyCompletedPostItsView = this.calculateEmptyPostIt(this.completedPostIts, window.innerWidth, false);
          }
        }
        // RESET FILTERS BUTTON ACTION
        if (result && result.buttonType === 'resetFilter') {
          if (isActivePostItFilter) {
            this.remindersPageService.setActivePreviousFilterInputValue(null);
            this.activePostIts = postIts;
            this.activePostItsFiltersCounter = 0;
            this.emptyActivePostItsView = this.calculateEmptyPostIt(this.activePostIts, window.innerWidth, true);
          } else {
            this.remindersPageService.setCompletedPreviousFilterInputValue(null);
            this.completedPostIts = postIts;
            this.completesPostItsFiltersCounter = 0;
            this.emptyCompletedPostItsView = this.calculateEmptyPostIt(this.completedPostIts, window.innerWidth, false);
          }
        }
      });
    }
  }

  convertTimestampToDate(timestamp: number) {
    const date = new Date(timestamp * 1000);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  usersAssociatedPostIt(postIts: PostItDto[]) {
    const associatedUsers: AssociatedUser[] = [];
    postIts.forEach(element => {
      if (element.shares && element.shares.length > 0) {
        element.shares.forEach(s => {
          const u = new AssociatedUser();
          u.userId = s.sharedWith;
          u.displayName = s.displayName;
          associatedUsers.push(u);
        });
      }
      if (element.userId !== this.authService.currentUser.id) {
        const u = new AssociatedUser();
        u.userId = element.userId;
        u.displayName = element.displayName;
        associatedUsers.push(u);
      }
    });
    // remove duplicates
    const setObj = new Set(); // create key value pair from array of array
    const result = associatedUsers.reduce((acc, item) => {
      if (!setObj.has(item.userId)) {
        setObj.add(item.userId);
        acc.push(item);
      }
      return acc;
    }, []); // converting back to array from mapobject
    return result;
  }

  backToDashboard() {
    this.router.navigateByUrl('/dashboard');
  }

  ngOnDestroy() {
    if (this.postItDoneSub) {
      this.postItDoneSub.unsubscribe();
    }
  }
}

export class AssociatedUser {
  userId: string;
  displayName: string;
}
