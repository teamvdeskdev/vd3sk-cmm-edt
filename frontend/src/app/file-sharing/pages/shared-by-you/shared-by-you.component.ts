import { Component, OnInit } from '@angular/core';
import { Utilities, FileSharingData } from '../../utilities';
import { FileSharingService } from '../../services/file-sharing.service';
import { Dictionary } from '../../dictionary/dictionary';
import { NgxSpinnerService } from 'ngx-spinner';
import { GroupFolderButton } from 'src/app/file-sharing/services/sidebar.service';

@Component({
  selector: 'app-shared-by-you',
  templateUrl: './shared-by-you.component.html',
  styleUrls: ['./shared-by-you.component.scss']
})
export class SharedByYouComponent implements OnInit {

  util = new Utilities();
  dataValue: FileSharingData[] = [];
  noData: boolean;
  dict = new Dictionary();
  getpage: string = 'shared-by-you';

  // CHECK PAGE
  pageFavorite: boolean;

  // DICTIONARY VARIABLES ---
  dictNoSharedByYouH3: string;
  dictNoSharedByYouP: string;
  //
  done: boolean = false;

  constructor(
    private fsService: FileSharingService,
    private spinner: NgxSpinnerService,
    private sendButton: GroupFolderButton,
  ) {
    // DICTIONARY VARIABLES ---
    this.dictNoSharedByYouH3 = this.dict.getDictionary('no_shared_you_h3');
    this.dictNoSharedByYouP = this.dict.getDictionary('no_shared_you_p');
    //
   }

  ngOnInit() {
    this.sendButton.toggle(false);
    this.spinner.show();
    // Get table data from server
    this.fsService.getSharedByYou().subscribe( (response: any) => {
      let data: any[] = [];
      data = response.body.ocs.data;

      if (data.length > 0) {
        // data array is not emp
        this.noData = false;

        // Format array data for the table
        this.dataValue = this.util.getShareFormattedResponse(data, 'byYou');
        this.dataValue.sort((a, b) => (a.lastUpdate < b.lastUpdate) ? 1 : -1);

      } else {
        this.noData = true;
      }

      this.spinner.hide();
      this.done = true;
    });

    this.pageFavorite = false;
  }

}

