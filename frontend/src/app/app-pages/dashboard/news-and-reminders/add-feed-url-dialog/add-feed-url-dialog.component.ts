import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DashboardCacheService } from 'src/app/app-services/dashboard-cache.service';
import { LanguageService } from 'src/app/app-services/language.service';
import { ShareService } from 'src/app/file-sharing/services/share.service';

@Component({
  selector: 'app-add-feed-url-dialog',
  templateUrl: './add-feed-url-dialog.component.html',
  styleUrls: ['./add-feed-url-dialog.component.scss']
})
export class AddFeedUrlDialogComponent implements OnInit {
  addFeedUrlForm: FormGroup;
  cacheFeederName = '';
  cacheFeederUrl = '';
  cacheFeederId: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddFeedUrlDialogComponent>,
    private shareService: ShareService,
    public langService: LanguageService,
    private dashboardCacheService: DashboardCacheService
  ) { }

  ngOnInit(): void {
    const feedersResponse = this.dashboardCacheService.getFeedersResponse();
    if (feedersResponse && feedersResponse.Dto && feedersResponse.Dto.length > 0) {
      this.cacheFeederName = feedersResponse.Dto[0].description;
      this.cacheFeederUrl = feedersResponse.Dto[0].url;
      this.cacheFeederId = feedersResponse.Dto[0].id;
    }
    this.addFeedUrlForm = new FormGroup({
      name: new FormControl(this.cacheFeederName, [Validators.required, Validators.maxLength(50)]),
      url: new FormControl(this.cacheFeederUrl, Validators.required),
    });
  }

  onConfirmClick() {
    if (this.addFeedUrlForm.valid) {
      const data: AddFeedUrlDialogModel = {
        status: 'Confirm',
        value: this.addFeedUrlForm.getRawValue(),
        idFeeder: this.cacheFeederId ? this.cacheFeederId : -1
      };
      this.dialogRef.close(data);
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }
}

export class AddFeedUrlDialogModel {
  public status: string;
  public value?: any;
  public idFeeder = -1;
}
