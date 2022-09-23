import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Dictionary } from '../../../dictionary/dictionary';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { VshareSettingsService } from 'src/app/file-sharing/services/vshare-settings.service';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { FileSharingService } from 'src/app/file-sharing/services/file-sharing.service';
import { Utilities, GroupFolder } from 'src/app/file-sharing/utilities';
import { MatTable } from '@angular/material/table';
import { indexOf } from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { GroupfolderDialogComponent } from './groupfolder-dialog/groupfolder-dialog.component';
import { GroupfolderDeletedialogComponent } from './groupfolder-deletedialog/groupfolder-deletedialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { globals } from 'src/config/globals';

@Component({
  selector: 'app-groupfolders',
  templateUrl: './groupfolders.component.html',
  styleUrls: ['./groupfolders.component.scss']
})
export class GroupfoldersComponent implements OnInit {
  dict = new Dictionary();
  util = new Utilities();
  titleGroupFolders: string;
  noData: boolean;
  noGroups: boolean;
  isdata: boolean = true;
  data: any = [];
  groups: any = [];
  buttonCreateHide: boolean = false;
  quotaArray = [];  
  list: boolean = false;
  singleGroup: any = [];

  stringName: string = this.dict.getDictionary('name');
  stringGroups: string = this.dict.getDictionary('groups');
  stringDelete: string = this.dict.getDictionary('delete-button');
  stringUpdate: string = this.dict.getDictionary('edit-button');
  headerTitle: string = this.dict.getDictionary('create_groupfolder');
  headerButton: string = this.dict.getDictionary('create_folder');
  headerSubtitle: string = this.dict.getDictionary('subtitle_groupfolder');
  nodataTitle: string = this.dict.getDictionary('groupfolder_nodata_title');
  nodataSubtitle: string = this.dict.getDictionary('groupfolder_nodata_subtitle');
  nodataBody: string = this.dict.getDictionary('groupfolder_nodata_body');  
  systemError: string = this.dict.getDictionary('error_system');
  dataUpdated: string = this.dict.getDictionary('data_updated_successfully');
  stringCreateFolder: string = this.dict.getDictionary('groupfolder_successfully_created');
  stringDeleteFolder: string = this.dict.getDictionary('groupfolder_successfully_deleted');

  displayedColumns: string[] = ['id', 'name', 'groups', 'quota', 'actions'];
  dataSource: MatTableDataSource<GroupFolder>;
  @ViewChild('name') name: ElementRef<HTMLInputElement>;
  globalsVar: any;

  static dataSourceStatic;
  isTim: boolean;
  @ViewChild(MatSort) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  @ViewChild('groupfoldername') groupfoldername: ElementRef<HTMLInputElement>;

  constructor(
    private vshSettingsService: VshareSettingsService,
    private fsService: FileSharingService,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    ) {
      this.globalsVar = globals;
   }

  ngOnInit() {
    this.showLoader();
    this.dataSource = GroupfoldersComponent.dataSourceStatic = new MatTableDataSource<GroupFolder>();
    this.titleGroupFolders = this.dict.getDictionary('sett_group_folders_title');
    this.quotaArray = ['1 GB', '5 GB', '10 GB', 'Unlimited'];
    this.isTim = (this.globalsVar.customCustomer.toLowerCase() == 'tim')? true : false;
    this.getAllGroupFolders();
  }

  showLoader(){
    this.isdata = false;
    this.spinner.show();
  }

  hideLoader(){
    this.spinner.hide();
    this.isdata = true;
  }

  createToast(message: string, type: string){
    this._snackBar.open(message, '', {
      duration: 4000,
      panelClass: 'toast-' + type
    });
  }

  async getAllGroupFolders(){
    let groupFolder = await this.fsService.getGroupfolderList().toPromise();
    if(groupFolder.body.ocs.meta.statuscode == 100){
      if(Object.values(groupFolder.body.ocs.data).length>0){
        this.data = this.util.getGroupFolderSettings(groupFolder.body.ocs.data);
        this.data.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
        let groups = await this.fsService.userGetGroups().toPromise();
        if(groups.ocs.meta.statuscode == 100){
          this.groups = (groups.ocs.data.groups.length>0)? groups.ocs.data.groups : [];
          this.noGroups = false;
          this.hideLoader();
        }else{
          this.noGroups = false;
          this.hideLoader();
        }
        this.noData = false;  
      }else{
        this.noData = true;
        this.hideLoader();
      }
    }else{
      this.noData = true;
      this.hideLoader();
    }

    this.dataSource = new MatTableDataSource<GroupFolder>();
    this.dataSource.data = this.data;
  }

  toggleCreate(){
    this.buttonCreateHide = !this.buttonCreateHide;
  }

  /** ADD GROUP FOLDER
   * Add new group folder
   * @param element (string) name of a folder
   **/
  async addGroupFolder(element: string){
    this.showLoader();
    let create = await this.fsService.getGroupfolderCreatefolder(element).toPromise();
    if(create.status == 500){
      this.createToast(this.systemError, 'error');
      this.hideLoader();
    }else if(create.status == 200){
      this.createToast(this.stringCreateFolder, 'success');
      this.buttonCreateHide = !this.buttonCreateHide;
      this.ngOnInit();
    }
  }

  /** DELETE GROUP FOLDER
   * Delete group folder
   * @param id (number)
   **/
  async deleteGroupFolder(id: number){
    let index = this.data.findIndex(x => x.id === id);
    let name = this.data[index].name;
    if(this.isTim){
      const dialogRef = this.dialog.open(GroupfolderDeletedialogComponent, {
        width: '40%',
        height: '30%',
        data: {name: name, secondDialog:false}
      });
      dialogRef.afterClosed().subscribe(async result => {
        const dialogRef = this.dialog.open(GroupfolderDeletedialogComponent, {
          width: '40%',
          height: '30%',
          data: {name: name, secondDialog:true}
        });
        dialogRef.afterClosed().subscribe(async resultTim => {
          if(resultTim) {
            let deleteGroup = await this.fsService.getGroupfolderDelete(id).toPromise();
            this.DeleteGroupFolder(id);
          }
        });  
      });
    } else {
      const dialogRef = this.dialog.open(GroupfolderDeletedialogComponent, {
        width: '40%',
        height: '30%',
        data: {name: name, secondDialog:false}
      });
      dialogRef.afterClosed().subscribe(async result => {
        if(!result){
          return;
        }else{
          this.DeleteGroupFolder(id);
        }
      });
    }
  }


  async DeleteGroupFolder(id){
    this.showLoader();
    let deleteGroup = await this.fsService.getGroupfolderDelete(id).toPromise();
    if(deleteGroup.status == 200){
      for(var i in this.data){
        if(this.data[i].id == id){
          this.data[i].delete = !this.data[i].delete;
          this.createToast(this.stringDeleteFolder, 'success');
          break;
        }
      }
      let arrayAll = this.data.filter(x => !x.delete);
      if(arrayAll.length == 0)
        this.noData = true;

      this.hideLoader();
    }else{
      this.createToast(this.systemError, 'error');
      this.hideLoader();
    }     
  }

  openDialogUpload(element: any){
    const dialogRef = this.dialog.open(GroupfolderDialogComponent, {
      width: '60%',
      height: '60%',
      data: {data: element, quotaList: this.quotaArray, groupList: this.groups}
    });

    dialogRef.afterClosed().subscribe(result => {      
      if(!result){
        return;
      }else{
        this.createToast(this.dataUpdated, 'success');
      }
    });
  }

}
