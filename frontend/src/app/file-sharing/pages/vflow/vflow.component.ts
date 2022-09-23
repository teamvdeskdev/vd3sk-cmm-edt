import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileSharingService } from '../../services/file-sharing.service';
import { Utilities, FileSharingData } from '../../utilities';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Dictionary } from '../../dictionary/dictionary';
import { GroupFolderButton } from 'src/app/file-sharing/services/sidebar.service';

@Component({
  selector: 'app-vflow',
  templateUrl: './vflow.component.html',
  styleUrls: ['./vflow.component.scss']
})
export class VflowComponent implements OnInit {
  util = new Utilities();
  dict = new Dictionary();
  dataValue = [];
  selected = 'attachmentsvpec'
  getpage: string = 'vflow';
  pageFavorite: boolean = false;
  noData: boolean;
  done: boolean = false;
  errorLoadingFiles: string = this.dict.getDictionary('error_system');

  deleted_file: string = this.dict.getDictionary('deleted_file');

  constructor(
    private fsService: FileSharingService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _snackBar: MatSnackBar,
    private sendButton: GroupFolderButton,
  ) { }

  ngOnInit() {
    this.sendButton.toggle(false);
    this.spinner.show();
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
    let result = await this.fsService.getOpenFolder('/vFlow').toPromise();
    if(result.status == 200){
      let response = result.body.multistatus.response;
      let username = result.username;
  
      if(response && Array.isArray(response)){      
        this.dataValue = this.util.getResponseFlow(response, username, false);
        this.dataValue.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
        this.dataValue.sort((a, b) => (b.file > a.file) ? 1 : -1);
        this.dataValue.sort((a, b) => (a.favorite < b.favorite) ? 1 : -1);
        this.noData = false;
        this.hideLoader();
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
