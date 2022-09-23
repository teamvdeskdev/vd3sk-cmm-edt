import { Component, OnInit } from '@angular/core';
import { FileSharingData, Utilities } from '../../utilities';
import { FileSharingService } from '../../services/file-sharing.service';
import { Dictionary } from '../../dictionary/dictionary';
import { NgxSpinnerService } from 'ngx-spinner';
import { GroupFolderButton } from 'src/app/file-sharing/services/sidebar.service';

@Component({
  selector: 'app-shared-by-link',
  templateUrl: './shared-by-link.component.html',
  styleUrls: ['./shared-by-link.component.scss']
})
export class SharedByLinkComponent implements OnInit {

  util = new Utilities();
  dataValue: FileSharingData[] = [];
  noData: boolean;
  dict = new Dictionary();
  getpage: string = 'shared-by-link';

  // CHECK PAGE
  pageFavorite: boolean;

  // DICTIONARY VARIABLES ---
  dictNoSharedLinkH3: string;
  dictNoSharedLinkP: string;
  //
  done: boolean = false;

  constructor(
    private fsService: FileSharingService,
    private spinner: NgxSpinnerService,
    private sendButton: GroupFolderButton,
  ) {
    // DICTIONARY VARIABLES ---
    this.dictNoSharedLinkH3 = this.dict.getDictionary('no_shared_link_h3');
    this.dictNoSharedLinkP = this.dict.getDictionary('no_shared_link_p');
    //
  }

  ngOnInit() {
    this.sendButton.toggle(false);
    this.spinner.show();
    // Get table data from server
    this.fsService.getSharedByLink().subscribe( (response: any) => {
      let data: any[] = [];
      data = response.body.ocs.data;
      // Format array data for the table
      data = this.util.getShareFormattedResponse(data, 'byYou');
      data.sort((a, b) => (a.lastUpdate < b.lastUpdate) ? 1 : -1);
      
      // Filter only the share by link
      const link = data.filter(share => share.url !== undefined);

      if (link.length > 0) {
        // link array contains at least a share by link        
        this.dataValue = link;
        this.noData = false;
      } else {
        this.noData = true;
      }

      this.spinner.hide();
      this.done = true;
    });

    this.pageFavorite = false;

  }

}
