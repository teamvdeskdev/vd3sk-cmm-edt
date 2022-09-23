import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { LanguageService } from 'src/app/settings/services/language.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS,} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { globals } from 'src/config/globals';

@Component({
  selector: 'app-dialog-create',
  templateUrl: './dialog-create.component.html',
  styleUrls: ['./dialog-create.component.scss'],
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
export class DialogCreateComponent implements OnInit {
  counterpage: string = '1 |';
  totalpage: string = ' 3';
  guestForm: FormGroup;
  invalid: boolean = false;  
  nameError: boolean = false;
  surnameError: boolean = false;
  companyError: boolean = false;
  mailError: boolean = false;
  firstBody: boolean = true;
  secondBody: boolean = false;
  thirdBody: boolean = false;
  arrayElement: any = [];
  checkApps: boolean = false;
  readStartDate: string = '';
  readEndDate: string = '';
  choosenApps: any = [];
  globalVars: any = globals;
  isCreate: boolean = this.data.create;
  dateMin = new Date();
  arrayComplete: any = [
    { name: 'VSHARE', box: '5 5 41 41', added: false, src: 'M38.782 17.626H26.198l-2.503-3.067c-.084-.104-.21-.163-.342-.159H13.201c-1.55.012-2.801 1.31-2.801 2.909v9.6c1.405-2.592 4.09-4.345 7.175-4.345h1.463v-4.642l6.882 7.78-6.882 7.78v-4.641h-.414c-3.09 0-6.044 1.264-8.224 3.5v1.554c.002 1.604 1.262 2.903 2.818 2.905h25.564c1.556-.002 2.816-1.301 2.818-2.905V20.53c-.002-1.603-1.262-2.903-2.818-2.905' },
    { name: 'VPEC', box: '3 4 45 45', added: false, src: 'M38.4 20l-12.8 8-12.8-8v-3.2l12.8 8 12.8-8V20zm0-6.4H12.8c-1.76 0-3.184 1.44-3.184 3.2L9.6 36c0 1.76 1.44 3.2 3.2 3.2h25.6c1.76 0 3.2-1.44 3.2-3.2V16.8c0-1.76-1.44-3.2-3.2-3.2z' },
    { name: 'VMEET', box: '-3 -2 43 43', added: false, src: 'M28.242 16.418V10.27c0-.966-.79-1.757-1.757-1.757H5.405c-.966 0-1.757.79-1.757 1.757v17.567c0 .966.791 1.756 1.757 1.756h21.08c.966 0 1.757-.79 1.757-1.756v-6.149l7.027 7.027V9.39l-7.027 7.027z' },
    { name: 'VFLOW', box: '-5 -6 44 44', added: false, src: 'M15.754 20.185H12.8c0-7.34 5.952-13.293 13.292-13.293v2.954c-5.715 0-10.338 4.623-10.338 10.339zm10.338-4.431V12.8c-4.076 0-7.384 3.308-7.384 7.385h2.954c0-2.452 1.979-4.431 4.43-4.431zM9.846 5.415c0-1.639-1.314-2.953-2.954-2.953-1.64 0-2.954 1.314-2.954 2.953 0 1.64 1.315 2.954 2.954 2.954 1.64 0 2.954-1.314 2.954-2.954zm6.572.739h-2.953c-.355 2.097-2.157 3.692-4.357 3.692H4.677c-1.226 0-2.215.99-2.215 2.216v3.692h8.861v-3.338c2.747-.871 4.8-3.294 5.095-6.262zM27.57 24.615c1.64 0 2.954-1.314 2.954-2.953 0-1.64-1.314-2.954-2.954-2.954-1.64 0-2.954 1.314-2.954 2.954 0 1.639 1.315 2.953 2.954 2.953zm2.216 1.477h-4.431c-2.2 0-4.003-1.595-4.357-3.692h-2.954c.295 2.969 2.348 5.39 5.095 6.262V32H32v-3.692c0-1.226-.99-2.216-2.215-2.216z' },
    { name: 'VCAL', box: '-7 -6 46 46', added: false, src: 'M28.369 3.016H26.86V0h-3.016v3.016H8.768V0H5.752v3.016H4.244c-1.658 0-3.015 1.357-3.015 3.015v24.125c0 1.658 1.357 3.015 3.015 3.015H28.37c1.658 0 3.015-1.357 3.015-3.015V6.03c0-1.658-1.357-3.015-3.015-3.015zm0 27.14H4.244V10.555H28.37v19.6z' },
    { name: 'VPEOPLE', box: '4 4 43 43', added: false, src: 'M33.713 32.792H19.949v-2.586c0-2.292 4.585-3.447 6.882-3.447 2.297 0 6.882 1.155 6.882 3.447v2.586zm-6.882-13.79c1.9 0 3.44 1.544 3.44 3.448s-1.54 3.447-3.44 3.447-3.441-1.543-3.441-3.447c0-1.904 1.54-3.448 3.44-3.448zM38.378 13.6H14.726c-2 0-3.622 1.625-3.622 3.63v1.952h-.975c-.513 0-.929.417-.929.931 0 .515.416.931.93.931h1.858c.513 0 .93.417.93.932 0 .514-.417.93-.93.93h-.884v8.05h-.975c-.513 0-.929.416-.929.93 0 .515.416.932.93.932h1.858c.513 0 .93.417.93.93 0 .515-.417.932-.93.932h-.884v.09c0 2.005 1.622 3.63 3.622 3.63h23.652c2 0 3.622-1.625 3.622-3.63V17.23c0-2.005-1.622-3.63-3.622-3.63z' },
    { name: 'VCANVAS', box: '-4 -4 47 47', added: false, src: 'M2.858 18.615h9.728V6.942H2.858v11.673zm0 13.62h9.728V20.56H2.858v11.673zm11.674 0h9.728V20.56h-9.728v11.673zm11.673 0h9.728V20.56h-9.728v11.673zm-11.673-13.62h9.728V6.942h-9.728v11.673zM26.205 6.942v11.673h9.728V6.942h-9.728z' },
  ];

  constructor(
    public dialogRef: MatDialogRef<DialogCreateComponent>,
    public langService: LanguageService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.guestForm = this.formBuilder.group({
      userName: new FormControl({value: this.data.update.name, disabled: !this.isCreate}, [Validators.required, Validators.maxLength(50)]),
      userSurname: new FormControl({value: this.data.update.surname, disabled: !this.isCreate}, [Validators.required, Validators.maxLength(50)]),
      userUsername: new FormControl({value: this.data.update.id, disabled: !this.isCreate}, [Validators.required, Validators.maxLength(50)]),
      userCompany: new FormControl(this.data.update.company, [Validators.required, Validators.maxLength(50)]),
      userMail: new FormControl(this.data.update.email, [Validators.required, Validators.maxLength(50), Validators.email]),
      dateStart: new FormControl({value: this.data.update.start, disabled: !this.isCreate}, [Validators.required]),
      dateEnd: new FormControl(this.data.update.end, [Validators.required]),
      managerName: new FormControl(this.data.update.managerName, [Validators.required, Validators.maxLength(50)]),
      managerSurname: new FormControl(this.data.update.managerSurname, [Validators.required, Validators.maxLength(50)]),
      managerMail: new FormControl(this.data.update.managerMail, [Validators.required, Validators.maxLength(50), Validators.email]),
      managerUid: new FormControl(this.data.update.managerId, [Validators.required, Validators.maxLength(50)]),
    });    
  }

  get userName() { return this.guestForm.get('userName'); }
  get userSurname() { return this.guestForm.get('userSurname'); }
  get userUsername() { return this.guestForm.get('userUsername'); }
  get userCompany() { return this.guestForm.get('userCompany'); }
  get userMail() { return this.guestForm.get('userMail'); }
  get dateStart() { return this.guestForm.get('dateStart'); }
  get dateEnd() { return this.guestForm.get('dateEnd'); }
  get managerName() { return this.guestForm.get('managerName') }
  get managerSurname() { return this.guestForm.get('managerSurname') }
  get managerMail() { return this.guestForm.get('managerMail') }
  get managerUid() { return this.guestForm.get('managerUid') }

  ngOnInit(): void {
    if(this.data.update.apps.length>0){
      for(let b in this.arrayComplete){
        if(this.data.update.apps.filter(x => x == this.arrayComplete[b].name).length>0)
          this.arrayComplete[b].added = true;
      }

      let checkArray = this.arrayComplete.filter(x => x.added);
      if((checkArray.length>0 && !this.checkApps) || (checkArray.length==0 && this.checkApps)) 
        this.checkApps = !this.checkApps;
    }

    for(let a in this.arrayComplete){
      if(this.data.icons.filter(x => x == this.arrayComplete[a].name).length>0){
        if(this.arrayComplete[a].name == 'VSHARE' && this.globalVars.enableVshare) this.arrayElement.push(this.arrayComplete[a]);
        else if(this.arrayComplete[a].name == 'VPEC' && this.globalVars.enableVpec) this.arrayElement.push(this.arrayComplete[a]);
        else if(this.arrayComplete[a].name == 'VMEET' && this.globalVars.enableVmeet) this.arrayElement.push(this.arrayComplete[a]);
        else if(this.arrayComplete[a].name == 'VFLOW' && this.globalVars.enableVFlow) this.arrayElement.push(this.arrayComplete[a]);
        else if(this.arrayComplete[a].name == 'VCAL' && this.globalVars.enableVcal) this.arrayElement.push(this.arrayComplete[a]);
        else if(this.arrayComplete[a].name == 'VCANVAS' && this.globalVars.enableVcanvas) this.arrayElement.push(this.arrayComplete[a]);
      }        
    }
  }

  showMessage(message: string, type: string){
    this._snackBar.open(message, '', {
      duration: 4000,
      panelClass: ('toast-' + type)
    });
  }

  /** GET GUEST
   * Get first page datas
   * Check values
   * Change page
   **/
  getGuest(){
    if (this.guestForm.invalid) {
      this.showMessage(this.langService.dictionary.error_guest_data,'error')
      return;
    }else{
      let startdate = new Date(this.dateStart.value);
      let enddate = new Date(this.dateEnd.value);
      this.readStartDate = startdate.getDate() + '/' + (startdate.getMonth()+1) + '/' + startdate.getFullYear();
      this.readEndDate = enddate.getDate() + '/' + (enddate.getMonth()+1) + '/' + enddate.getFullYear();
      this.firstBody = !this.firstBody;
      this.secondBody = !this.secondBody;
      this.counterpage = '2 |';
    }
  }

  backAgain(){
    if(this.secondBody){
      this.secondBody = !this.secondBody;
      this.firstBody = !this.firstBody;      
      this.counterpage = '1 |';
    }else{
      this.thirdBody = !this.thirdBody;
      this.secondBody = !this.secondBody;
      this.counterpage = '2 |';
    }    
  }

  selectApp(element){
    element.added = !element.added;
    let checkArray = this.arrayElement.filter(x => x.added);
    if((checkArray.length>0 && !this.checkApps) || (checkArray.length==0 && this.checkApps)) 
        this.checkApps = !this.checkApps;
  }

  getApps(){
    this.choosenApps = this.arrayElement.filter(x => x.added);
    this.secondBody = !this.secondBody;
    this.thirdBody = !this.thirdBody;
    this.counterpage = '3 |';
  }

  /** ON CONFIRM CLICK
   * Return to father component and close dialog
   * Send data to father component
   **/
  onConfirmClick(): void {
    let info = {
      name: this.userName.value,
      surname: this.userSurname.value,
      username: this.userUsername.value,
      company: this.userCompany.value,
      email: this.userMail.value,
      start: this.readStartDate,
      end: this.readEndDate,
      managerName: this.managerName.value,
      managerSurname: this.managerSurname.value,
      managerMail: this.managerMail.value,
      managerUid: this.managerUid.value,
    };

    let data = {
      apps: this.choosenApps,
      info: info,
    };
    this.dialogRef.close(data);
  }

  /** ON NO CLICK
   * Return to father component and close dialog
   **/
  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
