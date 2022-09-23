import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileSharingService } from '../../services/file-sharing.service';
import { Utilities, FileSharingData } from '../../utilities';
import { NgxSpinnerService } from 'ngx-spinner';
import { GroupFolderButton } from 'src/app/file-sharing/services/sidebar.service';

@Component({
  selector: 'app-protected-files',
  templateUrl: './protected-files.component.html',
  styleUrls: ['./protected-files.component.scss']
})
export class ProtectedFilesComponent implements OnInit {
//CHECK PAGE
util = new Utilities();
dataValue: FileSharingData[] = [];
getValue;
selected: string = 'protectedfile'
getpage: string = 'protected';
pageFavorite: boolean = false;
userId: any;
noData: boolean;
myArray = [];
done: boolean = false;

constructor(
  private fsService: FileSharingService,
  private route: ActivatedRoute,
  private spinner: NgxSpinnerService,
  private sendButton: GroupFolderButton,
  ) { }


ngOnInit() {
  this.sendButton.toggle(false);
  this.spinner.show();
  this.fsService.listProtectedFiles().subscribe((result: any) => {
    let response = result.Dto;
    let username = sessionStorage.getItem('user');

    if(response){
      this.dataValue = this.util.getResponseProtectedFiles(response, username);
      if(this.dataValue.length>0){
        this.noData = false;
        this.dataValue.sort((a, b) => (a.name < b.name) ? 1 : -1);
        this.dataValue.sort((a, b) => (b.file < a.file) ? 1 : -1);
        this.dataValue.sort((a, b) => (a.lastUpdate < b.lastUpdate)? 1 : -1);
      }else{
        this.noData = true;
      }      
    }else{
      this.noData = true;
    }
    this.spinner.hide();
    this.done = true;
  });
}

reload($event){
  this.fsService.listProtectedFiles().subscribe((result: any) => {
    let response = result.Dto;
    let username = sessionStorage.getItem('user');

    if(response){
      this.dataValue = this.util.getResponseProtectedFiles(response, username);
      if(this.dataValue.length>0){
        this.noData = false;
        this.dataValue.sort((a, b) => (a.name < b.name) ? 1 : -1);
        this.dataValue.sort((a, b) => (b.file < a.file) ? 1 : -1);
      }else{
        this.noData = true;
      }
      
    }else{
      this.noData = true;
    }
  });
}
}
