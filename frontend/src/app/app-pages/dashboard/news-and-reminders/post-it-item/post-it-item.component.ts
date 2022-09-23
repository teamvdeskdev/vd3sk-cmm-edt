import { Component, Input, OnInit } from '@angular/core';
import { CreateUpdatePostItRequest } from 'src/app/app-model/dashboard/CreateUpdatePostItRequest';
import { PostItDto } from 'src/app/app-model/dashboard/CreateUpdatePostItResponse';
import { DashboardService } from 'src/app/app-services/dashboard.service';
import { LanguageService } from 'src/app/app-services/language.service';
import { AuthenticationService } from 'src/app/app-shared/authentication.service';
import { NewsAndRemindersService } from '../news-and-reminders.service';

@Component({
  selector: 'app-post-it-item',
  templateUrl: './post-it-item.component.html',
  styleUrls: ['./post-it-item.component.scss']
})
export class PostItItemComponent implements OnInit {
  @Input() data: PostItDto;
  @Input() isRemindersPage: boolean;
  avatarUrl: string;
  postItDateAndTime: string;
  currentUserId: string;
  constructor(
    public langService: LanguageService,
    private dashService: DashboardService,
    private newsRemindersService: NewsAndRemindersService,
    private authService: AuthenticationService
  ) {
    this.currentUserId = this.authService.currentUser.id;
  }

  ngOnInit() {
    if (this.data.userId) {
      this.loadAvatar(this.data.userId);
    }
    if (this.data.createdAt) {
      this.formatTimeStamp(this.data.createdAt);
    }
  }

  clickDonePostIt(postItData: PostItDto) {
    this.newsRemindersService.startLoading();
    this.dashService.setCompletedPostIt(postItData.id).subscribe(response => {
      if (response.Performed) {
        this.dashService.clickPostItDone.next(postItData);
      } else {
        this.newsRemindersService.stopLoading();
      }
    });
  }

  loadAvatar(user: string) {
    this.dashService.getProfilePic(user, 30).subscribe((result: Blob) => {
      const self = this;
      const reader = new FileReader();
      reader.readAsDataURL(result);
      reader.onloadend = () => {
        const base64data = reader.result.toString().split(',')[1];
        this.avatarUrl = 'data:image/png;base64,' + base64data;
      };
    });
  }

  formatTimeStamp(timestamp: number) {
    const createdDate = new Date(timestamp * 1000);
    const day = createdDate.getDate();
    const month = createdDate.getMonth() + 1;
    const year = createdDate.getFullYear();
    const hours = createdDate.getHours();
    const minutes = createdDate.getMinutes();
    this.postItDateAndTime = day + '/' + month + '/' + year + ' | ' + this.addZero(hours) + ':' + this.addZero(minutes);
  }

  addZero(i: any) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }

  postItTooltip(data: PostItDto) {
    if (data) {
      if (data.userId !== this.currentUserId) {
        return this.langService.dictionary.tooltipSharedBy + ': ' + data.displayName;
      } else if (data.shares && data.shares.length > 0) {
        return this.langService.dictionary.tooltipSharedWith + ': ' + data.shares[0].displayName;
      }
    }
  }

  deletePostIt(data: PostItDto) {
    const postItId = data.id;
    this.dashService.deletePostIt(postItId).subscribe(result => {
    });
  }
}
