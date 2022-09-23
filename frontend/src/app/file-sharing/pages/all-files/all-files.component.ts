import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileSharingService } from '../../services/file-sharing.service';
import { Utilities, FileSharingData } from '../../utilities';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Dictionary } from 'src/app/file-sharing/dictionary/dictionary';
import { GlobalVariable } from 'src/app/globalviarables';
import { GroupFolderButton } from 'src/app/file-sharing/services/sidebar.service';

@Component({
  selector: 'app-all-files',
  templateUrl: './all-files.component.html',
  styleUrls: ['./all-files.component.scss']
})
export class AllFilesComponent implements OnInit {
  dict = new Dictionary();
  util = new Utilities();
  dataValue: FileSharingData[] = [];
  getpage: string = 'all-files';
  pageFavorite: boolean = false;
  noData: boolean;
  done: boolean = false;
  notify: string = '';
  notifyName: string = '';

  errorLoadingFiles: string = this.dict.getDictionary('sessionError');

  constructor(
    private fsService: FileSharingService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _snackBar: MatSnackBar,
    private _global: GlobalVariable,
    private router: Router,
    private sendButton: GroupFolderButton,
    ) { 
      //this.fsService.infoLoad.subscribe(result => {
      //  this.load();     //spostato all'interno di all-files-table
      //});
    }


  ngOnInit() {
    this.load();
  }


  load(){
    this.spinner.show();
    if(sessionStorage.VSHARE_path){
      this.notify = sessionStorage.getItem('VSHARE_path');
      let arrayNotify = this.notify.split('/');
      this.notifyName = arrayNotify[arrayNotify.length-1];
      this.loadData();
    } else this.loadData();  
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
      this.sendButton.toggle(true);
      let waitService = await this.fsService.getAllFiles('').toPromise();
      if(waitService.status == 200){
        let response = waitService.body.multistatus.response;

        if(response){
          this.dataValue = this.util.getResponseAllFiles(response, '', false);
          if(this.dataValue.length>0){
            this.dataValue.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
            this.dataValue.sort((a, b) => (b.file > a.file) ? 1 : -1);
            this.dataValue.sort((a, b) => (a.favorite < b.favorite) ? 1 : -1);
            this._global.dataAllFiles = this.dataValue;
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
      }else if(waitService == 403){
        this._snackBar.open(this.errorLoadingFiles, '', {
          duration: 4000,
          panelClass: 'sessionError'
        });
        this.noData = true;
        this.hideLoader();
        sessionStorage.clear();
        this.router.navigate(['login']);
      }
  }
}
