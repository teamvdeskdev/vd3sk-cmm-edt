import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileSharingService } from '../../services/file-sharing.service';
import { Utilities, FileSharingData } from '../../utilities';
import { NgxSpinnerService } from 'ngx-spinner';
import { GroupFolderButton } from 'src/app/file-sharing/services/sidebar.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  dataValue : FileSharingData[] = [];
  getValue;
  pageFavorite: boolean = true;
  getpage: string = 'favorites';
  noData: boolean;
  selected = 'favorites';
  util = new Utilities();
  userId: any;
  myArray = [];
  done: boolean = false;

  constructor(
    private fsService: FileSharingService,
    private spinner: NgxSpinnerService,
    private sendButton: GroupFolderButton,
  ) { }

  ngOnInit() {
    this.sendButton.toggle(false);
    this.spinner.show();
    this.fsService.getListFavorites().subscribe((result: any) => {
      let response = result.body.multistatus.response;

      if(response){
        this.noData = false;
        if(!Array.isArray(response)) this.dataValue = this.util.getResponseFavorites([response]);
        else this.dataValue = this.util.getResponseFavorites(response);
        this.dataValue.sort((a, b) => (a.name < b.name) ? 1 : -1);
        this.dataValue.sort((a, b) => (b.file < a.file) ? 1 : -1);
      }else{
        this.noData = true;
      }

      this.spinner.hide();
      this.done = true;
    });
  }

}
