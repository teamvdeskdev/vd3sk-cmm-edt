import { Component, OnInit } from '@angular/core';
import { FileSharingService } from '../../services/file-sharing.service';
import { Router } from '@angular/router';
import { Utilities, FileSharingData } from '../../utilities';
import { NgxSpinnerService } from 'ngx-spinner';
import { GroupFolderButton } from 'src/app/file-sharing/services/sidebar.service';

@Component({
  selector: 'app-recents',
  templateUrl: './recents.component.html',
  styleUrls: ['./recents.component.scss']
})

export class RecentsComponent implements OnInit {
  util = new Utilities();
  dataValue : FileSharingData[] = [];
  getpage: string = 'recents';
  pageFavorite: boolean = false;
  noData: boolean;
  done: boolean = false;

  constructor(
    private fsService: FileSharingService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private sendButton: GroupFolderButton,
  ) { }

  ngOnInit() {
    this.sendButton.toggle(false);
    this.spinner.show();
    this.fsService.getRecents().subscribe((result: any) => {
      let response = result.body.files;
      if(response){
        this.noData = false;
        this.dataValue = this.util.getElaborateResponse(response);
        this.dataValue.sort((a, b) => (a.name < b.name) ? 1 : -1);
        this.dataValue.sort((a, b) => (a.lastUpdate < b.lastUpdate) ? 1 : -1);
      }else{
        this.noData = true;
      }

      this.spinner.hide();
      this.done = true;
    });
  }

}
