import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Dictionary } from '../../../../dictionary/dictionary';
import { MatTableDataSource } from '@angular/material/table';
import { GroupFolder } from 'src/app/file-sharing/utilities';
import { FileSharingService } from 'src/app/file-sharing/services/file-sharing.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-groupfolder-dialog',
  templateUrl: './groupfolder-dialog.component.html',
  styleUrls: ['./groupfolder-dialog.component.scss']
})
export class GroupfolderDialogComponent implements OnInit {
  element: any;
  quota: any;
  groups: any;
  dict = new Dictionary();
  innerGroups: boolean;
  innerGroupsArray: any = [];
  checkArrayUpdate: any = [];
  cloneElement: any;
  isdata: boolean = true;

  nameinput: string;
  quotainput: any;

  stringTitle: string = this.dict.getDictionary('groupfolderdialog_title');
  stringName: string = this.dict.getDictionary('groupfolderdialog_name');
  stringQuota: string = this.dict.getDictionary('groupfolderdialog_quota');
  stringGroups: string =  this.dict.getDictionary('groupfolderdialog_groups');
  stringTable: string = this.dict.getDictionary('groupfolderdialog_groupstable');
  stringTableGroups: string = this.dict.getDictionary('group_title');
  stringTableWrite: string = this.dict.getDictionary('permission_write');
  stringTableShare: string = this.dict.getDictionary('share');
  stringTableDelete: string = this.dict.getDictionary('permission_delete');
  stringCancel: string = this.dict.getDictionary('cancel');
  stringSave: string = this.dict.getDictionary('save');
  noGroupFound: string = this.dict.getDictionary('nogroupfound');

  dataSource: MatTableDataSource<GroupFolder>;
  static dataSourceStatic;
  displayedColumns: string[] = ['name', 'write', 'share', 'delete'];

  constructor(
    private fsService: FileSharingService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<GroupfolderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.element = data.data;
    this.quota = data.quotaList;
    this.groups = data.groupList;
    this.cloneElement = data.clone;
   }

  ngOnInit() {
    this.nameinput = this.element.name;
    this.quotainput = this.element.quota;

    if(this.element.groupsObj.length>0){
      this.innerGroupsArray = this.element.groupsObj;
      this.innerGroups = true;
    }else{
      this.innerGroups = false;
    }
    this.dataSource = GroupfolderDialogComponent.dataSourceStatic = new MatTableDataSource<GroupFolder>();
    this.dataSource.data = this.innerGroupsArray;
  }

  showLoader(){
    this.isdata = false;
    this.spinner.show();
  }

  hideLoader(){
    this.spinner.hide();
    this.isdata = true;
  }

  /** UPDATE GROUPS
   * Add or remove groups
   * Create table if not shown
   **/
  updateGroups(group: string){
    // Check if table is populated
    if(this.innerGroupsArray.length>0){
      let index = this.innerGroupsArray.findIndex(x => x.name === group);
      let indexUpdate =  this.checkArrayUpdate.findIndex(y => y.name === group);
      if(index >= 0 && indexUpdate<0){
        // Remove existing group
        this.checkArrayUpdate.push({
          cancel: this.innerGroupsArray[index].cancel,
          name: group,
          permissions: this.innerGroupsArray[index].permissions,
          share: this.innerGroupsArray[index].share,
          write: this.innerGroupsArray[index].write,
          action: 'remove'
        });
        this.innerGroupsArray.splice(index, 1);
        this.dataSource.data = this.innerGroupsArray;        
      }else if(indexUpdate >= 0){
        let indexGroups = this.element.groupsArray.indexOf(group);
        this.element.groupsArray.splice(indexGroups, 1);
        this.checkArrayUpdate.splice(indexUpdate, 1);
      }else if(index < 0){
        // Add new group
        this.innerGroupsArray.push({
          cancel: true,
          name: group,
          permissions: 31,
          share: true,
          write: true
        });
        this.element.groupsObj = this.innerGroupsArray;
        this.dataSource.data = this.innerGroupsArray;
        this.checkArrayUpdate.push({name: group, action: 'add'});
      }
    }else{
      // On empty table
      // Add new group
      this.innerGroupsArray.push({
        cancel: true,
        name: group,
        permissions: 31,
        share: true,
        write: true
      });
      this.element.groupsObj = this.innerGroupsArray;
      this.innerGroups = true;
      this.dataSource.data = this.innerGroupsArray;
      this.checkArrayUpdate.push({name: group, action: 'add'});
    }
  }

  removeGroups(group: string){
    // Check if table is populated
    if(this.innerGroupsArray.length>0){
      let index = this.innerGroupsArray.findIndex(x => x.name === group);
      let indexUpdate =  this.checkArrayUpdate.findIndex(y => y.name === group);
      if(index >= 0 && indexUpdate<0){
        // Remove existing group
        this.checkArrayUpdate.push({
          cancel: this.innerGroupsArray[index].cancel,
          name: group,
          permissions: this.innerGroupsArray[index].permissions,
          share: this.innerGroupsArray[index].share,
          write: this.innerGroupsArray[index].write,
          action: 'remove'
        });
        this.innerGroupsArray.splice(index, 1);
        let indexGroups = this.element.groupsArray.indexOf(group);
        this.element.groupsArray.splice(indexGroups, 1);
        this.dataSource.data = this.innerGroupsArray;  
      }else if(indexUpdate >= 0){
        let indexGroups = this.element.groupsArray.indexOf(group);
        this.element.groupsArray.splice(indexGroups, 1);
        this.checkArrayUpdate.splice(indexUpdate, 1);
      }
    }
  }

  /** UPDATE GROUPS CHECKBOX
   * This function update the groups checkboxes
   * Save old values into "checkArrayUpdate" the first time
   * Then update permissions for table
   **/
  updateGroupsCheckbox(action: string, element: any){
    let share = element.share;
    let write = element.write;
    let cancel = element.cancel;
    let index = this.checkArrayUpdate.findIndex(x => x.name === element.name);

    if(index<0){
      if(action == 'share'){
        share = !share;
      }else if(action == 'write'){
        write = !write;
      }else{
        cancel = !cancel;
      }

      this.checkArrayUpdate.push({
        cancel: cancel,
        name: element.name,
        permissions: element.permissions,
        share: share,
        write: write,
        action: 'update'
      });
    }else{
      this.checkArrayUpdate[index].action2 = 'update';
    }

    element.permissions = this.elaboratePermissions(element);
    this.dataSource.data = this.innerGroupsArray;
  }

  /** ELABORATE PERMISSIONS
   * Check new permissions for table
   **/
  elaboratePermissions(element: any){
    let permission;
    if(element.write && element.share && element.cancel) permission = '31';
    else if(element.write && !element.share && !element.cancel) permission = '7';
    else if(!element.write && !element.share && element.cancel) permission = '9';
    else if(element.write && !element.share && element.cancel) permission = '15';
    else if(!element.write && element.share && !element.cancel) permission = '17';
    else if(element.write && element.share && !element.cancel) permission = '23';
    else if(!element.write && element.share && element.cancel) permission = '25';

    return permission;
  }

  async onConfirmClick() {
    this.showLoader();

    let renameFunc;
    let quotaFunc;
    let groupsFunc;

    // Change name
    if(this.nameinput != this.element.name){
      renameFunc = await this.fsService.getGroupfolderUpdatename(this.element.id, this.nameinput).toPromise();
    }
    
    if(renameFunc!=undefined && renameFunc.status != 200)
      return;
    else
      this.element.name = this.nameinput;

    // Change quota
    let quotareal;
    if(this.quotainput.toLowerCase() != this.element.quota.toLowerCase()){      
      let arrayCheck = ['kb', 'mb', 'gb', 'tb'];
      for(var a in arrayCheck){
        if(this.quotainput.toLowerCase().includes(arrayCheck[a].toLowerCase())){
          let index = this.quotainput.indexOf(arrayCheck[a]);
          let quotavalue = this.quotainput.substring(index, 2).trim();
          if(arrayCheck[a] == 'kb') quotareal = Math.pow(10, 3) * quotavalue;
          if(arrayCheck[a] == 'mb') quotareal = Math.pow(10, 6) * quotavalue;
          if(arrayCheck[a] == 'gb') quotareal = Math.pow(10, 9) * quotavalue;
          if(arrayCheck[a] == 'tb') quotareal = Math.pow(10, 12) * quotavalue;
          break;
        }
      }
      if(!quotareal)
        quotareal = -3;

      quotaFunc = await this.fsService.getGroupfolderAddQuota(this.element.id, quotareal).toPromise();
    }

    if(quotaFunc!=undefined && quotaFunc.status != 200)
      return;
    else{
      this.element.quota = this.quotainput;
      this.element.realquota = this.quotainput;
    }
      

    // GROUPS
    if(this.checkArrayUpdate.length>0){
      for(var b in this.checkArrayUpdate){
        if(this.checkArrayUpdate[b].action == 'remove'){
          groupsFunc = await this.fsService.getGroupfolderRemoveGroup(this.element.id, this.checkArrayUpdate[b].name).toPromise();
          if(groupsFunc!=undefined && groupsFunc.status != 200)
            return;
          else{
            let arrayElementGroups = this.element.groups.split(',');
            arrayElementGroups = arrayElementGroups.map(s => s.trim())
            let indexElement = arrayElementGroups.indexOf(this.checkArrayUpdate[b].name);
            arrayElementGroups.splice(indexElement, 1);
            this.element.groups = arrayElementGroups.join(', ');
          }
  
        }else if(this.checkArrayUpdate[b].action == 'add' && this.checkArrayUpdate[b].action2 == 'update'){
          groupsFunc = await this.fsService.getGroupfolderAddGroup(this.element.id, this.checkArrayUpdate[b].name).toPromise();
          if(groupsFunc!=undefined && groupsFunc.status != 200)
            return;
          else
            this.element.groups = (this.element.groups.length>0)? this.element.groups + ', ' + this.checkArrayUpdate[b].name : this.checkArrayUpdate[b].name;
  
          let indexGroupsObj = this.element.groupsObj.findIndex(x => x.name === this.checkArrayUpdate[b].name);
          groupsFunc = await this.fsService.getGroupfolderAddPermissions(this.element.id, this.checkArrayUpdate[b].name, this.element.groupsObj[indexGroupsObj].permissions).toPromise();
          if(groupsFunc!=undefined && groupsFunc.status != 200)
            return;
  
        }else if(this.checkArrayUpdate[b].action == 'add'){
          groupsFunc = await this.fsService.getGroupfolderAddGroup(this.element.id, this.checkArrayUpdate[b].name).toPromise();
          if(groupsFunc!=undefined && groupsFunc.status != 200)
            return;
          else
            this.element.groups = ((this.element.groups.length>0)? this.element.groups + ', ' : '') + this.checkArrayUpdate[b].name;
  
        }else if(this.checkArrayUpdate[b].action == 'update'){
          let indexGroupsObj = this.element.groupsObj.findIndex(x => x.name === this.checkArrayUpdate[b].name);
          groupsFunc = await this.fsService.getGroupfolderAddPermissions(this.element.id, this.checkArrayUpdate[b].name, this.element.groupsObj[indexGroupsObj].permissions).toPromise();
          if(groupsFunc!=undefined && groupsFunc.status != 200)
            return;
        }
      }
    }

    if(groupsFunc!=undefined && groupsFunc.status != 200)
      return;

    this.hideLoader();
    this.dialogRef.close(true);
  }

  /** ON NO CLICK
   * Check if there's an update before closing
   * Remove added groups
   * Restore deleted and updated groups
   **/
  onNoClick(): void {
    //remove all update done
    if(this.checkArrayUpdate.length>0){
      for(var i in this.checkArrayUpdate){
        let name = this.checkArrayUpdate[i].name;
        let action = this.checkArrayUpdate[i].action;

        // Get index of elements into the two groups array
        let indexGroupsArray = this.element.groupsArray.indexOf(name);
        let indexGroupsObj = this.element.groupsObj.findIndex(x => x.name === name);

        // Remove new groups if added
        if((indexGroupsArray>=0 && indexGroupsObj>=0) && action=='add'){
          this.element.groupsArray.splice(indexGroupsArray, 1);          
          this.element.groupsObj.splice(indexGroupsObj, 1);

        // Restore deleted groups
        }else if((indexGroupsArray<=0 && indexGroupsObj<0) && action=='remove'){
          this.element.groupsArray.push(name);          
          this.element.groupsObj.push({
            cancel: this.checkArrayUpdate[i].cancel,
            name: name,
            permissions: this.checkArrayUpdate[i].permissions,
            share: this.checkArrayUpdate[i].share,
            write: this.checkArrayUpdate[i].write
          });

        // Restore updated groups
        }else if((indexGroupsArray>=0 && indexGroupsObj>=0) && action=='update'){
          this.element.groupsObj[indexGroupsObj].cancel = this.checkArrayUpdate[i].cancel;
          this.element.groupsObj[indexGroupsObj].share = this.checkArrayUpdate[i].share;
          this.element.groupsObj[indexGroupsObj].write = this.checkArrayUpdate[i].write;
          this.element.groupsObj[indexGroupsObj].permissions = this.checkArrayUpdate[i].permissions;
        }
      } 
    }
    this.dialogRef.close(false);
  }

}
