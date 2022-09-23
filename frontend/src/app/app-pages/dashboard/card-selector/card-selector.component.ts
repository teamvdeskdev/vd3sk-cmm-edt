import { B } from '@angular/cdk/keycodes';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUser } from 'src/app/app-model/common/user';
import { CardSelectorModel } from 'src/app/app-model/dashboard/CardSelectorModel';
import { LanguageService } from 'src/app/app-services/language.service';
import { LogoService } from 'src/app/app-services/logo.service';
import { AuthenticationService } from 'src/app/app-shared/authentication.service';
import { globals } from 'src/config/globals';

@Component({
  selector: 'app-card-selector',
  templateUrl: './card-selector.component.html',
  styleUrls: ['./card-selector.component.scss']
})
export class CardSelectorComponent implements OnInit {
  @Input() isFirstCol: boolean;
  @Input() isLastCol: boolean;
  @Input() userApps: string[];
  @Input() cardName: string;
  @Input() spinner;
  @Input() set dataModel(value: CardSelectorModel) {
    if (value) {
      this.model = value;
      this.setVmeetData(this.model.vmeetCardData);
    }
  }
  get dataModel() {
    return this.model;
  }

  globalsVar: any;
  currentUser: CurrentUser;
  model: CardSelectorModel;
  meetingDataVmeet = [];
  roomDataVmeet = [];
  displayCard = false;
  notCustom: boolean = false;
  notPec: boolean = false;
  isTar: boolean;

  constructor(
    public langService: LanguageService,
    private authService: AuthenticationService,
    private router: Router,
    private logoService: LogoService
  ) {
    this.globalsVar = globals;
    this.currentUser = this.authService.currentUser;
  }

  ngOnInit(): void {
    this.isTar = (this.globalsVar.customCustomer.toLowerCase() == 'adp')? true : false;
    if(this.globalsVar.customCustomer.toLowerCase() == 'notariato'){
      this.notCustom = true;
      this.notPec = (sessionStorage.getItem('groups').includes('notbox-pec'))? true : false;
    }
    this.checkApps(this.userApps);
  }

  /**
   * Added by B.Ravaglia: controlla se visualizzare o meno la card corrente
   * basandosi sulle app associate al profilo dell'utente corrente
   * @param userApps
   */
  checkApps(userApps: string[]){
    if (userApps.length === 0 || userApps.includes(this.cardName.toUpperCase())) {
      this.displayCard = true;
    }   
  }

  setVmeetData(vmeetCardData: any) {
    if (vmeetCardData) {
      vmeetCardData.forEach(element => {
        if (element.scheduled) {
          const dateNow = new Date();
          const dateString = element.scheduled.date;
          const [ d, M, y ] = dateString.split(/[/]/);
          const timeEnd = element.scheduled.time_end;
          const [h, m] = timeEnd.split(/[:]/);
          const meetDateEnd = new Date();
          meetDateEnd.setFullYear(y, (M - 1), d);
          meetDateEnd.setHours(h);
          meetDateEnd.setMinutes(m);
          meetDateEnd.setSeconds(0);
          element.dateEnd = meetDateEnd;
          if (meetDateEnd >= dateNow) {
            this.meetingDataVmeet.push(element);
          }
        } else if (this.roomDataVmeet.length < 1) {
          // prendo una sola stanza tra quelle create in vmeet
          this.roomDataVmeet.push(element);
        }
      });
      if (this.meetingDataVmeet) {
        this.meetingDataVmeet.sort((a, b) => {
          if (a.dateEnd > b.dateEnd) {
            return 1;
          } else if (a.dateEnd < b.dateEnd) {
            return -1;
          } else {
            return 0;
          }
        });
        this.meetingDataVmeet = this.roomDataVmeet.length < 1 ?  this.meetingDataVmeet.slice(0, 3) : this.meetingDataVmeet.slice(0, 2) ;
      }
    }
  }

  goToApp(name: string) {
    switch (name) {
      case 'vShare':
        this.logoService.onLauncherClick('vShare');
        this.router.navigateByUrl('filesharing');
        break;
      case 'vPEC':
        this.logoService.onLauncherClick('vPEC');
        this.router.navigateByUrl('mail');
        break;
      case 'vCal':
        this.logoService.onLauncherClick('vCal');
        this.router.navigateByUrl('calendar');
        break;
      case 'vCanvas':
        this.logoService.onLauncherClick('vCanvas');
        this.router.navigateByUrl('canvas');
        break;
      case 'vFlow':
        this.logoService.onLauncherClick('vFlow');
        this.router.navigate(['flow']);
        break;
      case 'vShare':
        this.logoService.onLauncherClick('vShare');
        this.router.navigateByUrl('filesharing/all-files');
        break;
    }
  }
}
