import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DeviceSessionBody } from '../../../app-model/settings/DeviceSessionResp';
import { SystemSettingsService } from '../../services/system-settings.service';
import { LanguageService } from '../../services/language.service';
import { EditDeviceDialogComponent } from '../../components/edit-device-dialog/edit-device-dialog.component';
import { UserdialogPasswordComponent } from '../users-settings/components/userdialog-password/userdialog-password.component';

export interface WebClient {
  id: string;
  icon: string;
  device: string;
  OS: string;
  agent: string;
  info: string;
  name: string;
  functime: string;
}

@Component({
  selector: 'app-device-session',
  templateUrl: './device-session.component.html',
  styleUrls: ['./device-session.component.scss']
})
export class DeviceSessionComponent implements OnInit {

  displayedColumns: string[] = ['id', 'device', 'functime', 'menu'];
  dataSource: any;

  objDate = [
    { singular: 'year_ago', plural: 'years_ago', value: 31536000 },
    { singular: 'month_ago', plural: 'months_ago', value: 2628000 },
    { singular: 'week_ago', plural: 'weeks_ago', value: 604800 },
    { singular: 'day_ago', plural: 'days_ago', value: 86400 },
    { singular: 'hour_ago', plural: 'hours_ago', value: 3600 },
    { singular: 'minute_ago', plural: 'minutes_ago', value: 60 }
  ];

  constructor(
    private sysSettingsService: SystemSettingsService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    public langService: LanguageService
  ) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this.sysSettingsService.getDeviceSession().subscribe(result => {
      if (result && result.body && result.body.length > 0) {
        const listDeviceSession = result.body;
        listDeviceSession.sort((a: DeviceSessionBody, b: DeviceSessionBody) => {
          return b.lastActivity - a.lastActivity;
        });
        this.dataSource = listDeviceSession;
      }
    });
  }

  getNotifTimeFunc(unixTimestamp: number): any {
    const nowDate = Math.trunc(Date.now() / 1000);
    const result = nowDate - (unixTimestamp);
    let date: any;
    for (const item of this.objDate) {
      const counter = Math.trunc(result / item.value);
      if (counter > 0) {
        date = counter + ((counter > 1) ? this.langService.dictionary[item.plural] : this.langService.dictionary[item.singular]);
        break;
      }
    }
    if (!date) {
      date = this.langService.dictionary.less_minute;
    }

    return date;
  }

  revocation(element: DeviceSessionBody) {
    this.sysSettingsService.revocationDevice(element.id).subscribe(result => {
      this.load();
    });
  }

  deleteDevice(element: DeviceSessionBody) {
    this.sysSettingsService.deleteDevice(element.id).subscribe(result => {
      if (result && result.status === 200) {
        this.load();
      }
      if (result && result.status === 403) {
        // CONFIRM USER PASSWORD
        this.confirmUserPassword(element);
      }
    });
  }

  renameDevice(element: DeviceSessionBody) {
    const newElement = Object.assign({}, element);
    const dialogRef = this.dialog.open(EditDeviceDialogComponent, {
      width: '580px',
      height: '270px',
      data: { element: element},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        newElement.name = result;
        this.sysSettingsService.renameDevice(newElement).subscribe(result => {
          if (result && result.status === 200) {
            this._snackBar.open(this.langService.dictionary.update_successful, null, {
              duration: 4000,
              panelClass: 'toast-success'
            });
            this.load();
          }
          else if (result && result.status === 403) {
            this.confirmUserPassword(element);
          }
        })
      }
    });
    
  }


  confirmUserPassword(element: DeviceSessionBody) {
    const dialogRef = this.dialog.open(UserdialogPasswordComponent, {
      width: '370px',
      height: '270px',
      data: {},
    });

    dialogRef.afterClosed().subscribe(password => {
      if (password) {
        this.sysSettingsService.confirmPassword(password).subscribe(res => {
          if (res.status === 403) {
            this._snackBar.open(this.langService.dictionary.wrong_password, null, {
              duration: 4000,
              panelClass: 'toast-error'
            });
          } else {
            this.deleteDevice(element);
          }
        });
      }
    });
  }
}
