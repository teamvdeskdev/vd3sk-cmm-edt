import { Injectable, Output, EventEmitter, Directive } from '@angular/core';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class SidebarService {
  info = null;
  id = null;
  arrayid = [];
  arrayinfo = [];
  page = '';

  change: EventEmitter<any>;

  constructor() {
    this.change = new EventEmitter();
  }

  toggle(info, id, page) {
    if(!this.page) this.page = page;
    else if(this.page && this.page != page){
      this.info = null;
      this.id = null;
      this.arrayid = [];
      this.arrayinfo = [];
      this.page = page;
    }
    if(Array.isArray(info)){
      if(info.length>0){
        for(var i in info){
          if(!this.arrayid.includes(info[i].id)){
            this.arrayid.push(info[i].id);
            this.arrayinfo.push(info[i]);
          }          
        }
      }else{
        this.arrayid = [];
        this.arrayinfo = [];
      }
      this.change.emit(this.arrayinfo);
    }else{
      this.info = info;
      this.id = id;
      this.change.emit(this.info);
    }
  }

}

@Directive()
@Injectable()
export class SidebarTableService {
  info = null;
  id = null

  @Output() change: EventEmitter<any> = new EventEmitter();

  toggle(id, info, type, others){
    this.info = (!info)? null : info;
    this.id = (!info)? null : id;
    let data;
    if(!others){
      data = {
        id: id,
        info: info,
        type: type
      }
    }else{
      data = {
        id: id,
        info: info,
        type: type,
        others: others
      }
    }
    
    this.change.emit(data);
  }

}

@Injectable()
export class LinkTableSide {
  change: EventEmitter<any>;

  constructor() {
    this.change = new EventEmitter();
  }

  toggle(array, check) {
    let obj = {
      array: array,
      bool: check,
    }
    this.change.emit(obj);
  }  
}

@Directive()
@Injectable()
export class LinkSideTable {

  @Output() change: EventEmitter<any> = new EventEmitter();

  toggle(id, type, other) {
    let obj;
    if(!other || other.length<=0){
      obj = {id: id, type: type}
    }else{
      obj = {id: id, type: type, destination: other}
    }
    this.change.emit(obj);
  }
}

@Directive()
@Injectable()
export class exportActivityPDF {
  @Output() change: EventEmitter<any> = new EventEmitter();
  toggle(data) {
    let result = [];

    for(var a in data){
        for(var b in data[a][1]){
          let that = data[a][1][b];
          let date = new Date(that.datetime).toLocaleString();
          let author = (that.user.length>0 && that.subjectName)? that.user : window.sessionStorage.user;
          let action = that.subject;
          result.push([author, action, date]);
        }

    }

    this.change.emit(result);
  }
}

@Directive()
@Injectable()
export class LabelService {
  @Output() change: EventEmitter<any> = new EventEmitter();

  toggle(id, name) {
    let obj = {
      id: id,
      name: name,
    }
    this.change.emit(obj)
  }

}

@Directive()
@Injectable()
export class GroupFolderButton {
  @Output() change: EventEmitter<any> = new EventEmitter();

  toggle(create: boolean) {    
    this.change.emit(create)
  }

}

export class CreateService {
  @Output() changestatus: EventEmitter<any> = new EventEmitter();

  toggle(obj) {    
    this.changestatus.emit(obj);
  }
}

export class DeleteServiceAllfiles {
  @Output() deleteserviceallfiles: EventEmitter<any> = new EventEmitter();

  toggle(arrayid: any, event: string, destination: string, newid: any) {
    let data = {
      elements: arrayid,
      event: event,
      destinations: destination,
      newid: newid
    }
    this.deleteserviceallfiles.emit(data);
  }
}