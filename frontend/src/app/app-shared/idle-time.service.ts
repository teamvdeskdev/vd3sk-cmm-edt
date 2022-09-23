import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { globals } from 'src/config/globals';
import { ConfirmDialogComponent, ConfirmDialogDataModel } from '../app-components/dialogs/confirm-dialog/confirm-dialog.component';
import { AppConfig } from '../app-config';
import { LanguageService } from '../app-services/language.service';
import { LogoutService } from './logout.service';

@Injectable({
  providedIn: 'root'
})
export class IdleTimeService {

  idleState: string;
  countdown: any;
  timedOut: boolean;
  lastPing?: Date;
  dialogRef: any;
  globalsVar: AppConfig;

  constructor(
    private idle: Idle,
    private keepalive: Keepalive,
    private logoutService: LogoutService,
    private matDialog: MatDialog,
    public langService: LanguageService,
  ) {
    this.idleState = IdleState.NotStarted.toString();
    this.timedOut = false;
    this.lastPing = null;
    this.dialogRef = null;
    this.globalsVar = globals;
  }

  idleTime() {
    // tslint:disable-next-line: max-line-length
    const secondsToIdleTime = this.globalsVar.secondsToIdleTime !== 0 && this.globalsVar.secondsToIdleTime ? this.globalsVar.secondsToIdleTime : 1200;
    // sets an idle timeout of 20 minuts.
    this.idle.setIdle(secondsToIdleTime);
    // sets a timeout period of 60 seconds. after 21 minuts of inactivity, the user will be considered timed out.
    this.idle.setTimeout(60);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => {
      this.idleState = IdleState.NoLongerIdle;
    });

    this.idle.onTimeout.subscribe(() => {
      this.dialogRef.close();
      this.idleState = IdleState.TimedOut;
      this.timedOut = true;
      this.logoutService.logoutUser();
    });

    this.idle.onIdleStart.subscribe(() => {
      this.idleState = IdleState.GoneIdle;
      if (!this.dialogRef) {
        this.idle.clearInterrupts();
        this.openIdleDialog();
      }
    });

    this.idle.onTimeoutWarning.subscribe((countdown) => {
      this.countdown = countdown;
      this.idleState = IdleState.SecondsToTimeOut + countdown;
    });

    // sets the ping interval to 15 seconds
    this.keepalive.interval(15);
    this.keepalive.onPing.subscribe(() => this.lastPing = new Date());
    this.resetIdleTime();
  }

  resetIdleTime() {
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle.watch();
    this.idleState = IdleState.Started;
    this.timedOut = false;
    this.dialogRef = null;
  }

  stopIdle() {
    this.idle.stop();
    this.idleState = IdleState.NotStarted;
    this.timedOut = false;
  }

  openIdleDialog() {
    const dialogData = new ConfirmDialogDataModel();
    dialogData.title = this.langService.dictionary.idleTitleDialog;
    // tslint:disable-next-line: max-line-length
    dialogData.content = this.langService.dictionary.idleContentDialog;
    dialogData.textCancelBtn = this.langService.dictionary.idleLogoutBtn;
    dialogData.textConfirmBtn = this.langService.dictionary.idleStayLoggedBtn;
    dialogData.isIdleDialog = true;

    this.dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      maxWidth: '780px',
      data: dialogData
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result === 'Confirm') {
        this.resetIdleTime();
      } else {
        this.stopIdle();
        this.matDialog.closeAll();
        this.logoutService.logoutUser();
      }
    });
  }
}

export enum IdleState {
  Started = 'Started',
  NotStarted = 'Not started',
  NoLongerIdle = 'No longer idle',
  TimedOut = 'Timed out',
  GoneIdle = 'Gone idle',
  SecondsToTimeOut = 'Seconds to time out '
}
