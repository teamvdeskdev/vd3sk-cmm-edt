import { Component, OnInit } from '@angular/core';
import { Dictionary } from '../../../dictionary/dictionary';

@Component({
  selector: 'app-activitiesandnotifications',
  templateUrl: './activitiesandnotifications.component.html',
  styleUrls: ['./activitiesandnotifications.component.scss']
})
export class ActivitiesandnotificationsComponent implements OnInit {
  dict = new Dictionary();
  titleGeneral: string;
  titlePersonal: string;
  subString: string;
  mail: string;
  flow: string;
  data = [];
  data2 = [];
  sendmail: string;
  asap: string;
  everyhour: string;
  everyday: string;
  everyweek: string;
  notifyFavourites: string;

  constructor() { }

  ngOnInit() {
    this.titleGeneral = this.dict.getDictionary('general_activities');
    this.titlePersonal = this.dict.getDictionary('personal_activities');
    this.subString = this.dict.getDictionary('chose_notify_substring');
    this.mail = this.dict.getDictionary('mail');
    this.flow = this.dict.getDictionary('flow');
    this.sendmail = this.dict.getDictionary('sendmail');
    this.asap = this.dict.getDictionary('asap');
    this.everyhour = this.dict.getDictionary('everyhour');
    this.everyday = this.dict.getDictionary('everyday');
    this.everyweek = this.dict.getDictionary('everyweek');
    this.notifyFavourites = this.dict.getDictionary('limit_notify_favorites');

    //--- Array of all strings (so we can do faster html) ---//
    this.data = [
      {id: 1, string: this.dict.getDictionary('new_file_created'), mail: false, flow: true},
      {id: 2, string: this.dict.getDictionary('filefolder_updated_renamed'), mail: false, flow: true},
      {id: 3, string: this.dict.getDictionary('limit_notify_favorites'), mail: false, flow: true},
      {id: 4, string: this.dict.getDictionary('filefolder_deleted'), mail: false, flow: true},
      {id: 5, string: this.dict.getDictionary('filefolder_restore'), mail: false, flow: true},
      {id: 6, string: this.dict.getDictionary('file_addedremoved_favorites'), mail: false, flow: true},
      {id: 7, string: this.dict.getDictionary('filefolder_shared_server'), mail: false, flow: true},
      {id: 8, string: this.dict.getDictionary('filefolder_downloaded'), mail: false, flow: true},
      {id: 9, string: this.dict.getDictionary('calendar_updated'), mail: false, flow: true},
      {id: 10, string: this.dict.getDictionary('calendar_event_updated'), mail: false, flow: true},
      {id: 11, string: this.dict.getDictionary('calendar_task_updated'), mail: false, flow: true},
      {id: 12, string: this.dict.getDictionary('tag_updated'), mail: false, flow: true},
    ];

    this.data2 = [
      {id: 1, string: this.dict.getDictionary('list_flow'), checked: true},
      {id: 2, string: this.dict.getDictionary('notify_mail'), checked: false},
    ];
  }

  getChecked(id:number, type:string){
    for(var i in this.data){
      if(this.data[i].id == id){
        if(type=="mail") this.data[i].mail = !this.data[i].mail;
        else this.data[i].flow = !this.data[i].flow;
        break;
      }
    }
  }

}
