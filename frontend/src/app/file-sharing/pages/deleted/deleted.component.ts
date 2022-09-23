import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileSharingService } from '../../services/file-sharing.service';
import { Utilities, FileDeletedData } from '../../utilities';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Dictionary } from 'src/app/file-sharing/dictionary/dictionary';
import { GroupFolderButton } from 'src/app/file-sharing/services/sidebar.service';

@Component({
  selector: 'app-deleted',
  templateUrl: './deleted.component.html',
  styleUrls: ['./deleted.component.scss']
})
export class DeletedComponent implements OnInit {

  //CHECK PAGE
  util = new Utilities();
  dict = new Dictionary();
  dataValue: FileDeletedData[] = [];
  getValue;
  getpage: string = 'deleted';
  pageFavorite: boolean = false;
  userId: any;
  noData: boolean;
  myArray = [];
  done: boolean = false;

  unauthorized: string = this.dict.getDictionary('systemerror_unathorized');

  constructor(
    private fsService: FileSharingService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _snackBar: MatSnackBar,
    private sendButton: GroupFolderButton,
  ) {}

  ngOnInit() {
    this.sendButton.toggle(false);
    this.spinner.show();
    this.fsService.getDeletedFiles().subscribe((result: any) => {
      if(result.status==401){
        this._snackBar.open(this.unauthorized, '', {
          duration: 4000,
          panelClass: 'toast-error'
        }); 
        this.noData = true;
        this.spinner.hide();
        this.done = true;
      }else{
        let response = result.body.multistatus.response;
        if(response && Array.isArray(response)){
          this.dataValue = this.util.getResponseDeletedFiles(response);
          this.noData = false;
          this.dataValue.sort((a, b) => (a.name < b.name) ? 1 : -1);
          this.dataValue.sort((a, b) => (b.file < a.file) ? 1 : -1);
        }else{
          this.noData = true;
        }
  
        this.spinner.hide();
        this.done = true;
      }
      
    });
  }

  isEmpty(){
    this.noData = true;
  }

}
