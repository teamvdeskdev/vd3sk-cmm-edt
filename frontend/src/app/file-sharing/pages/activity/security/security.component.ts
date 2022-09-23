import { Component, OnInit } from '@angular/core';
import { ActivitiesService } from 'src/app/file-sharing/services/activities.service';
import { ActivityDataFormatService } from 'src/app/file-sharing/services/activity-data-format.service';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { NgxSpinnerService } from 'ngx-spinner';
import { Dictionary } from 'src/app/file-sharing/dictionary/dictionary';
import { exportActivityPDF } from 'src/app/file-sharing/services/sidebar.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {

  // DICTIONARY VARIABLES ---
  dictAlertNoNewData: string;
  // ---
  dict = new Dictionary();
  noNewData: boolean;
  notscrolly = true;

  noData: boolean;
  today: string;
  userLang: string;
  tableList: any[] = [];
  getpage: string;
  done: boolean = false;
  done2: boolean = true;

  constructor(
    private activService: ActivitiesService,
    private activFormatService: ActivityDataFormatService,
    private spinner: NgxSpinnerService,
    private exportActivityPDF: exportActivityPDF,
  ) {

    // DICTIONARY VARIABLES ---
    this.dictAlertNoNewData = this.dict.getDictionary('alert_no_new_data');
    // ---

    this.userLang = sessionStorage.getItem('user_language');
    if (this.userLang === 'it') {
      registerLocaleData(localeIt, 'it');
    }
    this.today = new Date().toDateString();

    this.getpage = 'activity'; // Is the same for all activity page
  }

  ngOnInit() {
    this.spinner.show();
    this.loadInitActivities();
  }

  /**
   * Get the first tranche of activities to view
   */
  loadInitActivities() {
    const firstActivityId = 0;
    this.activService.getActivSecurity(firstActivityId).subscribe( result => {
      const data = (result.body.ocs !== undefined) ? result.body.ocs.data : null;

      if (data) {
        this.spinner.hide();
        this.done = true;
        this.noData = false;
        this.tableList = this.activFormatService.getActivFormattedData(data);
        this.exportActivityPDF.toggle(this.tableList);

      } else {
        this.spinner.hide();
        this.done = true;
        this.noData = true;
      }
    });
  }

  /**
   * Intercepts the end of the view scroll by the user
   */
  onScroll() {
    if (this.notscrolly && !this.noNewData) {
      this.done2 = false;
      this.spinner.show();
      this.notscrolly = false;
      this.loadNextActivities();
    }
  }

  /**
   * Get the next tranche of activities to view
   */
  loadNextActivities() {
    // Get last activities list from displayed array
    const lastActivitiesList: any[] = this.tableList[this.tableList.length - 1];

    // Get the last activity from last displayed activities list
    const lastActivity = lastActivitiesList[1][lastActivitiesList[1].length - 1];

    // Get id of last activity for backend API call
    const lastActivityId = lastActivity.activity_id;

    // Use this id to get next activities data from API
    this.activService.getActivSecurity(lastActivityId).subscribe( result => {
      const data = (result.body.ocs !== undefined) ? result.body.ocs.data : null;

      this.spinner.hide();
      this.done2 = true;

      if (data) {
        this.noNewData = false;
        const newData = this.activFormatService.getActivFormattedData(data);

        // Get first activities list from new array
        const firstActivitiesList: any[] = newData[0];
        // Get date from first new activities list
        const dateFirstNew = firstActivitiesList[0];
        // Check if dateFirstNew is equal the date of lastActivitiesList, in positive case
        // merge without duplicates firstActivitiesList[1] and lastActivitiesList[1]
        if (dateFirstNew === lastActivitiesList[0]) {
          /*const merge = _.uniqBy([...lastActivitiesList[1], ...firstActivitiesList[1]], 'activity_id');
          newData[0][1] = merge;*/

          // Remove lastActivitiesList from displayed array
          this.tableList.splice((this.tableList.length - 1), 1);
        }
        // add newly fetched activities to the existing activities
        this.tableList = this.tableList.concat(newData);

        this.notscrolly = true;

      } else {
        this.noNewData = true;
      }

    });
  }

}

