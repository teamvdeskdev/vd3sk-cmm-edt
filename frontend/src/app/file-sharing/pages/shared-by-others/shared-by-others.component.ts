import { Component, OnInit } from '@angular/core';
import { FileSharingService } from '../../services/file-sharing.service';
import { Utilities, FileSharingData } from '../../utilities';
import { Dictionary } from '../../dictionary/dictionary';
import { NgxSpinnerService } from 'ngx-spinner';
import { GroupFolderButton } from 'src/app/file-sharing/services/sidebar.service';

@Component({
  selector: 'app-shared-by-others',
  templateUrl: './shared-by-others.component.html',
  styleUrls: ['./shared-by-others.component.scss']
})
export class SharedByOthersComponent implements OnInit {

  util = new Utilities();
  dataValue: FileSharingData[] = [];
  noData: boolean;
  dict = new Dictionary();
  getpage: string = 'shared-by-others';

  // CHECK PAGE
  pageFavorite: boolean;

  // DICTIONARY VARIABLES ---
  dictNoSharedByOthersH3: string;
  dictNoSharedByOthersP: string;
  //
  done: boolean = false;

  constructor(
    private fsService: FileSharingService,
    private spinner: NgxSpinnerService,
    private sendButton: GroupFolderButton,
  ) {
    // DICTIONARY VARIABLES ---
    this.dictNoSharedByOthersH3 = this.dict.getDictionary('no_shared_others_h3');
    this.dictNoSharedByOthersP = this.dict.getDictionary('no_shared_others_p');
    //
   }

  ngOnInit() {
    this.sendButton.toggle(false);
    this.spinner.show();
    // Get table data from server
    this.fsService.getSharedByOthers().subscribe( (response: any) => {
      // Retrieve the first array data
      let data1: any[] = [];
      data1 = response.body.ocs.data;

      this.fsService.getSharedByOthersRemote().subscribe( (response2: any) => {
        // Retrieve the second array data
        let data2: any[] = [];
        data2 = response2.body.ocs.data;

        // Merge first and second array data
        let data: any[] = [];
        data = [...data1, ...data2];

        if (data.length > 0) {
          // data array si not empty
          this.noData = false;

          // Format array data for the table
          this.dataValue = this.util.getShareFormattedResponse(data, 'byOthers');
          this.dataValue.sort((a, b) => (a.lastUpdate < b.lastUpdate) ? 1 : -1);

        } else {
          this.noData = true;
        }

        this.spinner.hide();
        this.done = true;
      });
    });

    this.pageFavorite = false;
  }

}

