import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/app-shared/authentication.service';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/app-services/dashboard.service';
import { GlobalVariable } from 'src/app/globalviarables';
import { CurrentUser } from 'src/app/app-model/common/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LanguageService } from 'src/app/app-services/language.service';
import { ChatService } from 'src/app/app-services/chat.service';

@Component({
  selector: 'app-flow-page',
  templateUrl: './flow-page.component.html',
  styleUrls: ['./flow-page.component.scss']
})
export class FlowPageComponent implements OnInit {

  loginToken: string;
  tokenVerified = false;
  client: string;
  grantLink: string;
  openLogin = false;
  openLoginTotp = false;
  loginDone = false;
  clientAuthorized: boolean;
  phase1 = false;
  phase2 = false;
  phase3 = false;
  error = false;
  errorMessage: string;
  currentUser: CurrentUser;

  constructor(
    private authService: AuthenticationService,
    private dashService: DashboardService,
    private router: Router,
    private snackBar: MatSnackBar,
    public langService: LanguageService,
    private global: GlobalVariable,
    private chatService: ChatService,
  ) {
    this.chatService.hideChat();
  }


  ngOnInit() {
    this.dashService.setShowHeader(false);
    const res = this.router.url.split("/login/v2/flow/");
    this.loginToken = res[1];
    this.authService.verifyV2Token(this.loginToken).subscribe(response => {
      if (response.performed) {
        this.tokenVerified = true;
        this.phase1 = true;
        this.client = response.clientIdentifier;
        this.grantLink = response.grantLink;
      } else {
        this.error = true;
        this.errorMessage = response.error;
        this.snackBar.open(this.errorMessage, '', {
          duration: 3000,
          panelClass: 'toast-error'
        });
      }
    });
   }

   login() {
    if (this.authService.currentUser) {
      this.currentUser = this.authService.currentUser;
      this.loginDone = true;
      this.phase1 = false;
      this.phase2 = true;
    } else {
      this.openLogin = true;
    }
   }

  loggedIn(logged: boolean) {
    this.loginDone = logged;
    this.openLogin = false;
    this.openLoginTotp = false;
    this.phase1 = false;
    this.phase2 = true;
  }

  loggedTotp(loggedTotp: boolean) {
    this.openLogin = false;
    this.openLoginTotp = loggedTotp;
    // this.phase1 = false;
    // this.phase2 = true;
  }

  grantAccess() {
    this.authService.grantV2Access(this.loginToken).subscribe(response => {
      this.phase2 = false;
      this.phase3 = true;
      if (response.authorized) {
        this.clientAuthorized = true;
      } else {
        this.errorMessage = response.message;
        this.snackBar.open(this.errorMessage, '', {
          duration: 3000,
          panelClass: 'toast-error'
        });
      }
    });
  }

}

