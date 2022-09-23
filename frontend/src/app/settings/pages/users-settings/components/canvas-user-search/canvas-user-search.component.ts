import { Component, OnInit } from '@angular/core';
import { Utilities } from 'src/app/file-sharing/utilities';
import { NgxSpinnerService } from 'ngx-spinner';
import {MatDialog} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminSettingsService } from '../../../../services/admin-settings.service';
import { LanguageService } from 'src/app/settings/services/language.service';

@Component({
  selector: 'app-canvas-user-search',
  templateUrl: './canvas-user-search.component.html',
  styleUrls: ['./canvas-user-search.component.scss']
})
export class CanvasUserSearchComponent implements OnInit {
  util = new Utilities();
  data: any = [];
  groups: any = [];
  isdata = false;
  dataDone = false;
  pageUser = true;
  offset = 0;
  notscrolly = true;
  spinnerOn = false;
  namequery = '';
  noData: boolean;
  getpage = 'search-result';

  constructor(
    private adminService: AdminSettingsService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    public langService: LanguageService) { }

  ngOnInit() {
    this.route.params.subscribe( parameter => {
      this.namequery = parameter.query;

      this.data = [];
      this.groups = [];
      if (!this.spinnerOn) {
        this.isdata = false;
        this.spinner.show();
      }

      this.adminService.userSearchUser(this.offset, this.namequery).subscribe((result: any) => {
        const response = result.ocs.data.users;
        this.data = this.util.elaborateUserSettings(response, true, false);
        this.adminService.userGetGroups().subscribe((result: any) => {
          this.groups = (result.ocs.data.groups.length > 0) ? result.ocs.data.groups : [];
          this.closeLoader();
          this.dataDone = true;
          this.noData = (this.data.length > 1) ? false : true;
        });
      });
    });
  }
  

  // CLOSE LOADER
  closeLoader() {
    this.spinner.hide();
    this.isdata = true;
  }
}
