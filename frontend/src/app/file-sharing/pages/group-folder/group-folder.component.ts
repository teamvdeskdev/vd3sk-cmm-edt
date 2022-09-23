import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileSharingService } from '../../services/file-sharing.service';
import { Utilities, FileSharingData } from '../../utilities';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GroupFolderButton } from 'src/app/file-sharing/services/sidebar.service';
import { Dictionary } from 'src/app/file-sharing/dictionary/dictionary';


@Component({
  selector: 'app-group-folder',
  templateUrl: './group-folder.component.html',
  styleUrls: ['./group-folder.component.scss']
})
export class GroupFolderComponent implements OnInit {
  dict = new Dictionary();
  util = new Utilities();
  dataValue: FileSharingData[] = [];
  getValue;
  selected = 'group-folder';
  getpage: string = 'groupfolder';
  pageFavorite: boolean = false;
  userId: any;
  noData: boolean;
  myArray = [];
  done: boolean = false;
  permissions: any;
  blockActions: boolean = true;
  errorLoadingFiles: string = this.dict.getDictionary('error_system');

  constructor(
    private fsService: FileSharingService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _snackBar: MatSnackBar,
    private sendButton: GroupFolderButton,
    ) { 
      this.fsService.infoLoad.subscribe(result => {
        this.loadData();
      });
    }


  ngOnInit() {
    this.spinner.show();
    this.sendButton.toggle(false);
    this.loadData();
  }

  hideLoader(){
    this.spinner.hide();
    this.done = true;
  }

  showLoader(){
    this.done = false;
    this.spinner.show();
  }

  async loadData(){
    let waitService = await this.fsService.getAllFiles('').toPromise();
    if(waitService.status == 200){
      this.permissions = {
        isCrearable: false,
        isDeletable: false,
        isSharable: false,
      };
      let response = waitService.body.multistatus.response;

      if(response){
        this.dataValue = this.util.getResponseGroupFolders(response, false);
        if(this.dataValue.length>0){
          this.dataValue.sort((a, b) => (a.name < b.name) ? 1 : -1);
          this.dataValue.sort((a, b) => (b.file < a.file) ? 1 : -1);
          this.dataValue.sort((a, b) => (a.favorite < b.favorite) ? 1 : -1);
          this.noData = false;
          this.hideLoader();
        }else{
          this.noData = true;
          this.hideLoader();
        }
        
      }else{
        this.noData = true;
        this.hideLoader();
      }
    }else{
      this._snackBar.open(this.errorLoadingFiles, '', {
        duration: 4000,
        panelClass: 'toast-error'
      });
      this.noData = true;
      this.hideLoader();
    }
      
  }

}
