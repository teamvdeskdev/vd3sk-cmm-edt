import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/app-shared/authentication.service';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/app-services/dashboard.service';
import { GlobalVariable } from 'src/app/globalviarables';
import { FlowV2Model } from 'src/app/app-model/login-v2/FlowV2Model';

@Component({
  selector: 'app-login-v2',
  templateUrl: './login-v2.component.html',
  styleUrls: ['./login-v2.component.scss']
})
export class LoginV2Component implements OnInit {

  constructor(
    private authService: AuthenticationService,
    private dashService: DashboardService,
    private router: Router,
    private global: GlobalVariable,
  ) {
  }


  ngOnInit() {
    this.dashService.setShowHeader(false);
    this.authService.startV2Flow().subscribe(response => {
      if (response) {
        let c = response.login;
        // c = c.replace('https://vdesk-demo.liveboxcloud.com/', 'http://localhost:4200/');
        // window.open(c);
        const res = c.split("/login/v2/flow/");
        // c = c.replace('https://vdesk-demo.liveboxcloud.com/', '');
        c = c.replace(res[0] + '/', '');
        this.router.navigateByUrl(c);
      }
    });
  }


}

