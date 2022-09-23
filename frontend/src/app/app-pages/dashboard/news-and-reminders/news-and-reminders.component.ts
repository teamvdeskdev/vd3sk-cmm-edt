import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { CreateUpdatePostItRequest } from 'src/app/app-model/dashboard/CreateUpdatePostItRequest';
import { PostItDto } from 'src/app/app-model/dashboard/CreateUpdatePostItResponse';
import { FeedModel } from 'src/app/app-model/dashboard/FeedModel';
import { Feeders, LoadFeedsRequest } from 'src/app/app-model/dashboard/LoadFeedsRequest';
import { LoadPostItRequest } from 'src/app/app-model/dashboard/LoadPostItRequest';
import { SharePostItRequest } from 'src/app/app-model/dashboard/SharePostItRequest';
import { Row } from 'src/app/app-model/dashboard/UserDashboardModel';
import { DashboardCacheService } from 'src/app/app-services/dashboard-cache.service';
import { DashboardService } from 'src/app/app-services/dashboard.service';
import { LanguageService } from 'src/app/app-services/language.service';
import { OrderModule } from '../draggable-card/draggable-card.component';
import { AddFeedUrlDialogComponent, AddFeedUrlDialogModel } from './add-feed-url-dialog/add-feed-url-dialog.component';
import { AddPostItDialogComponent } from './add-post-it-dialog/add-post-it-dialog.component';
import { NewsAndRemindersService } from './news-and-reminders.service';
import { NewsRemindersCustomSnackbarComponent } from './news-reminders-custom-snackbar/news-reminders-custom-snackbar.component';

@Component({
  selector: 'app-news-and-reminders',
  templateUrl: './news-and-reminders.component.html',
  styleUrls: ['./news-and-reminders.component.scss']
})
export class NewsAndRemindersComponent implements OnInit, OnDestroy {
  @Input() set dataFeeds(value: FeedModel[]) {
    if (value) {
      this.feeds = value;
    }
  }
  @Input() set dataPostIt(value: PostItDto[]) {
    if (value && value.length > 0) {
      this.allPostItData = value;
    }
  }
  @Input() newsRow: Row;
  @Input() orderModule: OrderModule;
  feeds: FeedModel[];
  allPostItData: PostItDto[];
  postIts: PostItDto[];
  newsOrderIndex: number;
  remindersOrderIndex: number;
  sharedUser = '';
  postItDoneSub: Subscription;
  loadPostItSub: Subscription;
  dialogPostItSub: Subscription;
  createUpdatePostItSub: Subscription;
  sharePostItSub: Subscription;
  feedDialogSub: Subscription;
  addUpdateFeederSub: Subscription;
  loadFeedsSub: Subscription;
  spinnerName: string;
  emptyPostIt = [];
  constructor(
    public langService: LanguageService,
    private dashService: DashboardService,
    private dashboardCacheService: DashboardCacheService,
    private dialog: MatDialog,
    private newsRemindersService: NewsAndRemindersService,
    private snackBar: MatSnackBar
  ) {
    this.spinnerName = this.newsRemindersService.spinnerName;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.calculatePostItNumberToShow(this.allPostItData, event.target.innerWidth);
  }

  ngOnInit() {
    this.calculatePostItNumberToShow(this.allPostItData, window.innerWidth);
    if (this.orderModule) {
      this.newsOrderIndex = this.orderModule.orderNews;
      this.remindersOrderIndex = this.orderModule.orderReminders;
    } else {
      this.newsOrderIndex = this.newsRow.orderNews;
      this.remindersOrderIndex = this.newsRow.orderReminders;
    }
    // click done on post-it
    this.postItDoneSub = this.dashService.clickPostItDone.subscribe(resultPostIt => {
      if (resultPostIt) {
        const message = '<span>' +
          this.langService.dictionary.successDonePostItMsg1 +
          ' <b>' + resultPostIt.title + '</b> ' +
          this.langService.dictionary.successDonePostItMsg2 +
          '</span>';
        this.openCustomNewsRemindersSnackbar(message);
        this.refreshPostItData();
      }
    });
  }

  calculatePostItNumberToShow(postItData: PostItDto[], browserWindowWidth: number) {
    const paddingPostItArea = 20; // padding-right di "news-and-reminders-container"
    const postItWidth = 229; // 211px (width) + 18px (margin-right)
    const numbeOfPostItPerRow = Math.floor(((browserWindowWidth / 2) - paddingPostItArea) / postItWidth);
    if (postItData) {
      this.postIts = postItData.slice(0, (numbeOfPostItPerRow * 2) - 1); // tolgo 1 elemento per lasciare spazio al pulsante add promemoria
    }
    // empty post-it
    let numberOfEmptyPostIt = 0;
    if (postItData && (postItData.length < (numbeOfPostItPerRow * 2) - 1)) {
      numberOfEmptyPostIt = (numbeOfPostItPerRow * 2) - (postItData.length + 1);
    } else if (!postItData || postItData && postItData.length === 0) {
      numberOfEmptyPostIt = (numbeOfPostItPerRow * 2) - 1;
    }
    if (numberOfEmptyPostIt > 0) {
      this.emptyPostIt = new Array(numberOfEmptyPostIt).fill('empty');
    } else {
      this.emptyPostIt = [];
    }
  }

  refreshPostItData(callFromCreate?: boolean, postItTitle?: string) {
    const loadPostItReq: LoadPostItRequest = {
      skip: 0,
      take: 20
    };
    this.loadPostItSub = this.dashService.loadPostIt(loadPostItReq).subscribe(resp => {
      if (resp.Performed && resp.Dto && resp.Dto.length > 0) {
        const notCompletedPostIt = resp.Dto.filter(p => !p.completed);
        notCompletedPostIt.sort(function (x, y) {
          return y.createdAt - x.createdAt;
        });
        this.allPostItData = notCompletedPostIt;
        this.dashboardCacheService.setCachePostItModel(this.allPostItData);
        this.calculatePostItNumberToShow(notCompletedPostIt, window.innerWidth);
        if (callFromCreate) {
          const message = '<span>' +
            this.langService.dictionary.successCreatePostItMsg1 +
            ' <b>' + postItTitle + '</b> ' +
            this.langService.dictionary.successCreatePostItMsg2 +
            '</span>';
          this.openCustomNewsRemindersSnackbar(message);
        }
      }
      this.newsRemindersService.stopLoading();
      this.dashService.isSavingPostIts = false;
    });
  }

  openAddPostItDialog() {
    this.dashService.isSavingPostIts = true;
    const dialogRef = this.dialog.open(AddPostItDialogComponent, {
      minWidth: '780px',
      data: {},
    });
    this.dialogPostItSub = dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'Confirm' && result.value) {
        this.newsRemindersService.startLoading();
        this.sharedUser = result.value.shareInput && result.value.shareInput.length > 0 ? result.value.shareInput[0] : '';
        let body = result.value.description;
        let title = result.value.title;
        const createModel: CreateUpdatePostItRequest = {
          title: title.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
          body: body.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
          completed: false
        };
        this.createUpdatePostItSub = this.dashService.createOrUpdatePostIt(createModel).subscribe(respCreate => {
          if (respCreate && respCreate.Performed && respCreate.Dto) {
            if (this.sharedUser) {
              const shareModel: SharePostItRequest = {
                shareType: 'user',
                target: this.sharedUser, // da sostituire con la lista degli utenti quando sarà modificato il BE
                todoId: respCreate.Dto.id
              };
              this.sharePostItSub = this.dashService.sharePostIt(shareModel).subscribe(respShare => {
                this.refreshPostItData(true, respCreate.Dto.title);
              });
            } else {
              this.refreshPostItData(true, respCreate.Dto.title);
            }
          } else {
            this.newsRemindersService.stopLoading();
          }
        });
      } else {
        this.dashService.isSavingPostIts = false;
      }
    });
  }

  openAddFeedUrlDialog() {
    this.dashService.isSavingFeeders = true;
    const dialogRef = this.dialog.open(AddFeedUrlDialogComponent, {
      minWidth: '780px',
      data: {},
    });
    this.feedDialogSub = dialogRef.afterClosed().subscribe((result: AddFeedUrlDialogModel) => {
      if (result && result.status === 'Confirm' && result.value) {
        const idFeeder = result.idFeeder ? result.idFeeder : null;
        this.addUpdateFeederSub = this.dashService.addUpdateFeeder(result.value.name, result.value.url, idFeeder).subscribe(result => {
          if (result && result.Performed && result.Dto) {
            // update cache feeders
            const feedersResponse = this.dashboardCacheService.getFeedersResponse();
            if (feedersResponse && feedersResponse.Dto && feedersResponse.Dto.length > 0) {
              const founded = feedersResponse.Dto.find(f => f.id === result.Dto.id);
              founded.description = result.Dto.description;
              founded.url = result.Dto.url;
            }
            const message = this.langService.dictionary.successFeedUrlUpdateMsg;
            this.openCustomNewsRemindersSnackbar(message);
            this.refreshFeedsData(result.Dto.id);
          }
        });
      } else {
        this.dashService.isSavingFeeders = false;
      }
    });
  }

  refreshFeedsData(idFeeder: number) {
    const feedRequest = new LoadFeedsRequest();
    feedRequest.feeders = [];
    const feeders = new Feeders();
    feeders.id = idFeeder ? idFeeder : -1;
    feeders.take = 3;
    feedRequest.feeders.push(feeders);
    this.loadFeedsSub = this.dashService.loadFeeds(feedRequest).subscribe(result => {
      if (result.Performed && result.Dto && result.Dto.length > 0) {
        this.feeds = result.Dto[0];
        this.dashboardCacheService.setCacheFeedModel(this.feeds);
      }
      this.dashService.isSavingFeeders = false;
    });
  }

  openCustomNewsRemindersSnackbar(message: string) {
    this.snackBar.openFromComponent(NewsRemindersCustomSnackbarComponent, {
      data: message,
      duration: 5000,
      panelClass: 'news-reminders-snackbar'
    });
  }

  hideNewsAndRemindersArea() {
  }

  ngOnDestroy() {
    this.allPostItData = [];
    this.postIts = [];
    if (this.postItDoneSub) {
      this.dashService.clickPostItDone.next(null);
      this.postItDoneSub.unsubscribe();
    }
    if (this.loadPostItSub) {
      this.loadPostItSub.unsubscribe();
    }
    if (this.dialogPostItSub) {
      this.dialogPostItSub.unsubscribe();
    }
    if (this.createUpdatePostItSub) {
      this.createUpdatePostItSub.unsubscribe();
    }
    if (this.sharePostItSub) {
      this.sharePostItSub.unsubscribe();
    }
    if (this.feedDialogSub) {
      this.feedDialogSub.unsubscribe();
    }
    if (this.addUpdateFeederSub) {
      this.addUpdateFeederSub.unsubscribe();
    }
    if (this.loadFeedsSub) {
      this.loadFeedsSub.unsubscribe();
    }
  }
}
