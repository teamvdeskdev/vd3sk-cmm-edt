import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { LanguageService } from 'src/app/settings/services/language.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS,} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { globals } from 'src/config/globals';
import { AdminSettingsService } from 'src/app/settings/services/admin-settings.service';
import { AppConfig } from 'src/app/app-config';

@Component({
  selector: 'app-samluser-dialogcreate',
  templateUrl: './samluser-dialogcreate.component.html',
  styleUrls: ['./samluser-dialogcreate.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'it-IT' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class SamluserDialogcreateComponent implements OnInit {
  usersamlForm: FormGroup;
  groups: any = [];
  isCreate: boolean = this.data.create;
  arrayApps: any = this.data.appsList;
  isUserManager: boolean;
  showApps: boolean = false;
  getProfileValue: boolean;
  arrayListApps: any = [];
  myFilter;
  dateMin = new Date();
  isTim : boolean;
  globalsVar: AppConfig;

  quotaList = [
    {id: '1 GB', name: '1 GB'},
    {id: '5 GB', name: '5 GB'},
    {id: '10 GB', name: '10 GB'},
    {id: 'none', name: this.langService.dictionary.nolimits}
  ];

  profileList = [
    {id: 'Admin', name: 'Admin'},
    {id: 'GGU', name: 'GGU'},
    {id: 'User', name: 'User'},
    {id: 'FGM', name: 'FGM'},
  ];

  constructor(
    public dialogRef: MatDialogRef<SamluserDialogcreateComponent>,
    public langService: LanguageService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private adminSettingsService: AdminSettingsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.globalsVar = globals;
    this.isTim = (this.globalsVar.customCustomer.toLowerCase() == 'tim')? true : false;
    this.usersamlForm = this.formBuilder.group({
      userName: new FormControl({value: ((this.data.user.userinfo.nome)? this.data.user.userinfo.nome : ''), disabled: !this.isCreate}, [Validators.required, Validators.maxLength(50)]),
      userSurname: new FormControl({value: ((this.data.user.userinfo.cognome)? this.data.user.userinfo.cognome : ''), disabled: !this.isCreate}, [Validators.required, Validators.maxLength(50)]),
      userMail: new FormControl(this.data.user.email, [Validators.required, Validators.maxLength(50), Validators.email]),
      userSerial: new FormControl({value: ((this.data.user.userinfo.uid)? this.data.user.userinfo.uid : ''), disabled: !this.isCreate}, [Validators.required, Validators.maxLength(50)]),
      userQuota: new FormControl(this.data.user.quota, [Validators.required, Validators.maxLength(50)]),
      userProfile: new FormControl(((this.data.user.role)? this.data.user.role : ''), [Validators.required, Validators.maxLength(50)]),
      userApps: new FormControl(this.data.user.apps),
      userGroups: new FormControl(this.data.user.groups, [Validators.required]),
      managerName: new FormControl(((this.data.user.userinfo.nomeResponsabile)? this.data.user.userinfo.nomeResponsabile : ''), [Validators.required, Validators.maxLength(50)]),
      managerSurname: new FormControl(((this.data.user.userinfo.cognomeResponsabile)? this.data.user.userinfo.cognomeResponsabile : ''), [Validators.required, Validators.maxLength(50)]),
      managerMail: new FormControl(((this.data.user.userinfo.emailResponsabile)? this.data.user.userinfo.emailResponsabile : ''), [Validators.required, Validators.maxLength(50), Validators.email]),
      managerUid: new FormControl(((this.data.user.userinfo.uidResponsabile)? this.data.user.userinfo.uidResponsabile : ''), [Validators.required, Validators.maxLength(50)]),
      dateStart: new FormControl({value: ((this.data.user.userinfo.dataInserimento)? this.data.user.userinfo.dataInserimento : ''), disabled: !this.isCreate}, [Validators.required]),
      dateEnd: new FormControl(this.data.user.userinfo.dataCessazione, [Validators.required]),
      societaName: new FormControl (((this.data.user.userinfo.societa)? this.data.user.userinfo.societa : ''),[Validators.required, Validators.maxLength(50)]),
    });
  }

  get userName() { return this.usersamlForm.get('userName'); }
  get userSurname() { return this.usersamlForm.get('userSurname'); }
  get userMail() { return this.usersamlForm.get('userMail'); }
  get userSerial() { return this.usersamlForm.get('userSerial'); }
  get dateStart() { return this.usersamlForm.get('dateStart'); }
  get dateEnd() { return this.usersamlForm.get('dateEnd'); }
  get userQuota() { return this.usersamlForm.get('userQuota'); }
  get userProfile() { return this.usersamlForm.get('userProfile'); }
  get userApps() { return this.usersamlForm.get('userApps'); }
  get userGroups() { return this.usersamlForm.get('userGroups'); }
  get managerName() { return this.usersamlForm.get('managerName'); }
  get managerSurname() { return this.usersamlForm.get('managerSurname'); }
  get managerMail() { return this.usersamlForm.get('managerMail'); }
  get managerUid() { return this.usersamlForm.get('managerUid'); }
  get societaName() { return this.usersamlForm.get('societaName'); }

  ngOnInit(): void {
    this.filterDate();

    if(!this.data.create){
      this.showAppsComponent();
    }

    const userManager = sessionStorage.getItem('userManager');
    if (userManager !== undefined && userManager === 'true') {
      this.isUserManager = true;
      let index = this.profileList.findIndex(e=>e.id == 'Admin');
      this.profileList.splice(index,1);
    } else {
      this.isUserManager = false;
    }
    this.adminSettingsService.userGetGroups().subscribe((result: any) => {
      this.groups = (result.ocs.data.groups.length > 0) ? result.ocs.data.groups : [];
    });
  }

  filterDate(){
    this.myFilter = (d: Date | null): boolean => {
      const day = (d || new Date()).getDay();
      return day !== 0 && day !== 6;
    }
  }

  showAppsComponent(){
    if(this.userProfile.value == 'GGU'){
      if(this.showApps) this.showApps = !this.showApps;
    }else{
      if(!this.showApps) this.showApps = !this.showApps;
      this.getProfileValue = (this.userProfile.value == 'Admin')? true : false;
      this.arrayListApps = (this.userProfile.value == 'Admin')? this.arrayApps : this.userApps.value;
    }
  }

  /** ON CONFIRM CLICK
   * Return to father component and close dialog
   * Send data to father component
   **/
   onConfirmClick(): void {
    let startdate = new Date(this.dateStart.value).getTime()/1000;
    let enddate = new Date(this.dateEnd.value).getTime()/1000;
    let data, isFolderManager, isUserManager, sendApps;
    if(this.userProfile.value.toLowerCase() != 'user' && (!this.userGroups.value.find(x=> x =='admin'))){
      this.userGroups.value.push('admin');
    }
    if (this.societaName.value.toLowerCase() == 'esterno' ){
      this.usersamlForm.controls.societaName.setErrors({ pattern: true });
      console.log('error');
      return;
    }

    if (this.isCreate) {
        data = {
          nome: this.userName.value,
          cognome: this.userSurname.value,
          email: this.userMail.value,
          matricola: this.userSerial.value,
          dataInserimento: startdate,
          dataCessazione: enddate,
          uidResponsabile: this.managerUid.value,
          nominativoResponsabile: this.managerName.value + ' ' + this.managerSurname.value,
          emailResponsabile: this.managerMail.value,
          quota : this.userQuota.value,
          profilo: this.userProfile.value,
          gruppi : [],
          societa : this.societaName.value,
        };

      isFolderManager = (this.userProfile.value == 'FGM')? true : false;
      isUserManager = (this.userProfile.value == 'GGU')? true : false;
      if(this.userProfile.value == 'FGM' || this.userProfile.value == 'GGU' || this.userProfile.value == 'Admin'){
        if(!this.userGroups.value.includes('admin')) this.userGroups.value.push('admin');
      }else{
        if(this.userGroups.value.includes('admin')){
          const index = this.userGroups.value.findIndex(e=>e== 'admin');
          this.userGroups.value.splice(index,1);
        }
      }
      data.gruppi = this.userGroups.value;
    }else {
        data = {
          nome: this.userName.value,
          cognome: this.userSurname.value,
          email: this.userMail.value,
          matricola: this.userSerial.value,
          dataInserimento: startdate,
          dataCessazione: enddate,
          uidResponsabile: this.managerUid.value,
          nominativoResponsabile: this.managerName.value + ' ' + this.managerSurname.value,
          emailResponsabile: this.managerMail.value,
          quota : this.userQuota.value,
          profilo: this.userProfile.value,
          gruppi : [],
          uid: this.userSerial.value,
          societa : this.societaName.value,
        };
      isFolderManager = (this.userProfile.value == 'FGM')? true : false;
      isUserManager = (this.userProfile.value == 'GGU')? true : false;
      if(this.userProfile.value == 'FGM' || this.userProfile.value == 'GGU' || this.userProfile.value == 'Admin'){
        if(!this.userGroups.value.includes('admin')) this.userGroups.value.push('admin');
      }else{
        if(this.userGroups.value.includes('admin')){
          const index = this.userGroups.value.findIndex(e=>e== 'admin');
          this.userGroups.value.splice(index,1);
        }
      }
      data.gruppi = this.userGroups.value;
    }

    if(this.userProfile.value == 'Admin') sendApps = this.arrayApps;
    else if(this.userProfile.value == 'GGU') sendApps = [];
    else sendApps = this.userApps.value;

    let toSend = {
      data: data,
      folder: isFolderManager,
      user: isUserManager,
      apps: sendApps,
    }

    this.dialogRef.close(toSend);
  }

  /** ON NO CLICK
   * Return to father component and close dialog
   **/
  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
