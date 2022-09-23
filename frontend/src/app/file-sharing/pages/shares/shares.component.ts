import { Component, OnInit } from '@angular/core';
import { FileSharingService } from '../../services/file-sharing.service';
import { Utilities, FileSharingData } from '../../utilities';
import { Dictionary } from '../../dictionary/dictionary';
import { NgxSpinnerService } from 'ngx-spinner';
import { GroupFolderButton } from 'src/app/file-sharing/services/sidebar.service';

@Component({
  selector: 'app-shares',
  templateUrl: './shares.component.html',
  styleUrls: ['./shares.component.scss']
})
export class SharesComponent implements OnInit {

  util = new Utilities();
  dataValue: FileSharingData[] = [];
  noData: boolean;
  dict = new Dictionary();

  // CHECK PAGE
  pageFavorite: boolean = false;
  getpage: string = 'shares';

  // DICTIONARY VARIABLES ---
  dictNoSharesH3: string;
  dictNoSharesP: string;
  //
  done: boolean = false;

  constructor(
    private fsService: FileSharingService,
    private spinner: NgxSpinnerService,
    private sendButton: GroupFolderButton,
  ) {
    // DICTIONARY VARIABLES ---
    this.dictNoSharesH3 = this.dict.getDictionary('no_shares_h3');
    this.dictNoSharesP = this.dict.getDictionary('no_shares_p');
    //
   }

  ngOnInit() {
    this.sendButton.toggle(false);
    this.spinner.show();
    // Get shared by you from server
    this.fsService.getSharedByYou().subscribe( (response: any) => {
      // Format array data for the table
      let sharedByYouData: any[] = [];
      sharedByYouData = this.util.getShareFormattedResponse(response.body.ocs.data, 'byYou');

      // Get shared by others from server
      this.fsService.getSharedByOthers().subscribe( (response1: any) => {
        // Retrieve the first array data
        let data1: any[] = [];
        data1 = response1.body.ocs.data;

        this.fsService.getSharedByOthersRemote().subscribe( (response2: any) => {
          // Retrieve the second array data
          let data2: any[] = [];
          data2 = response2.body.ocs.data;

          // Merge first and second array data for "shared by others"
          data1 = [...data1, ...data2];

          // Format array data for the table
          let sharedByOthersData: any[] = [];
          sharedByOthersData = this.util.getShareFormattedResponse(data1, 'byOthers');

          if (sharedByYouData.length > 0 || sharedByOthersData.length > 0) {
            // data array is not empty
            this.noData = false;

            // Fill the table to display
            this.dataValue = [...sharedByYouData, ...sharedByOthersData];
            
            this.dataValue.sort((a, b) => (a.lastUpdate < b.lastUpdate) ? 1 : -1);
            // Eliminate duplicates between "shared by you" and "shared by others"
            /*
            this.dataValue = this.mergeObjectsInUnique(fullData, 'name');
            */

          } else {
            this.noData = true;
          }
          this.spinner.hide();
          this.done = true;
        });
      });
      
    });
  }

  /*
  mergeObjectsInUnique(array: any[], property: any): any[] {
    const newArray = new Map();

    array.forEach((item) => {
      const propertyValue = item[property];
      if (newArray.has(propertyValue)) {
        newArray.set(propertyValue, { ...item, ...newArray.get(propertyValue) });
      } else {
        newArray.set(propertyValue, item);
      }

    });

    return Array.from(newArray.values());
  }
  */

}
