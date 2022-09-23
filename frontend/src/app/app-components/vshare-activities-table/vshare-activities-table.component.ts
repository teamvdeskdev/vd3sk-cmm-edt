import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { registerLocaleData } from '@angular/common';
import { UtilitiesService } from 'src/app/app-services/utilities.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LogoService } from 'src/app/app-services/logo.service';

@Component({
  selector: 'app-vshare-activities-table',
  templateUrl: './vshare-activities-table.component.html',
  styleUrls: ['./vshare-activities-table.component.scss']
})
export class VshareActivitiesTableComponent implements OnInit {

  @Input() set dataValue(value: any) {
    if (value) {
      this.dataSource = value;
    }
  }
  displayedColumns: string[] = ['id', 'profile_pic', 'image', 'description', 'icons', 'date', 'time'];
  dataSource: MatTableDataSource<any>;

  constructor(
    private utilityService: UtilitiesService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private logoService: LogoService
    ) {}

  ngOnInit() {

  }

  openActivities(row: any) {
    this.spinner.show();
    this.router.navigateByUrl('filesharing/activities/others').finally(() => {
      this.spinner.hide();
    });
    this.logoService.onLauncherClick('vShare');
  }

  getDate(dateString: string) {
    return this.utilityService.getFormattedDate(dateString);
  }
}


