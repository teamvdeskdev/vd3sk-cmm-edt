import { Component, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileSharingService } from '../../services/file-sharing.service';
import { Utilities, FileSharingData } from '../../utilities';
import { SearchbarService } from 'src/app/app-services/searchbar.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

  //CHECK PAGE
  util = new Utilities();
  dataValue: FileSharingData[] = [];
  getValue;
  selected = 'all-files';
  getpage: string;
  pageFavorite: boolean;
  userId: any;
  noData: boolean;
  myArray = [];
  done: boolean = false;

  constructor(
    private fsService: FileSharingService,
    private route: ActivatedRoute,
    private searchbarService: SearchbarService,
    private spinner: NgxSpinnerService,
    ) { }


  ngOnInit() {
    this.showLoader();
    this.route.params.subscribe( parameter => {
      const query = parameter.query;

      this.fsService.getSearchResult(query).subscribe( result => {
        const response: any[] = result.body;

        if (response && response.length > 0) {
          this.noData = false;
          this.dataValue = this.util.getResponseSearchResult(response);
          this.dataValue.sort((a, b) => (a.name < b.name) ? 1 : -1);
          this.dataValue.sort((a, b) => (b.file < a.file) ? 1 : -1);
        } else {
          this.noData = true;
        }
        this.hideLoader();
      });

      this.pageFavorite = false;
      this.getpage = 'search-result';
    });
  }

  hideLoader(){
    this.spinner.hide();
    this.done = true;
  }

  showLoader(){
    this.done = false;
    this.spinner.show();
  }

}

