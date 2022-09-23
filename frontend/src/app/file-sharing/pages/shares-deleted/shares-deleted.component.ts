import { Component, OnInit } from '@angular/core';
import { FileSharingService } from '../../services/file-sharing.service';
import { Utilities, FileSharingData } from '../../utilities';
import { Dictionary } from '../../dictionary/dictionary';

@Component({
  selector: 'app-shares-deleted',
  templateUrl: './shares-deleted.component.html',
  styleUrls: ['./shares-deleted.component.scss']
})
export class SharesDeletedComponent implements OnInit {

  util = new Utilities();
  dataValue: FileSharingData[] = [];
  noData: boolean;
  dict = new Dictionary();
  getpage: string = 'shares';

  // CHECK PAGE
  pageFavorite: boolean;

  // DICTIONARY VARIABLES ---
  dictNoSharesDeletedH3: string;
  dictNoSharesDeletedP: string;
  //

  constructor(private fsService: FileSharingService) {
    // DICTIONARY VARIABLES ---
    this.dictNoSharesDeletedH3 = this.dict.getDictionary('no_shares_deleted_h3');
    this.dictNoSharesDeletedP = this.dict.getDictionary('no_shares_deleted_p');
    //
   }

  ngOnInit() {
    // TODO: Get shares deleted from server

    this.noData = true;
  }

}

