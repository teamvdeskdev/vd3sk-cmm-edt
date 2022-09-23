import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FileSharingService } from '../../services/file-sharing.service';
import { SearchbarService } from 'src/app/app-services/searchbar.service';
import { Utilities, FileSharingData } from '../../utilities';
import { Dictionary } from '../../dictionary/dictionary';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.scss']
})
export class LabelsComponent implements OnInit {
  dict = new Dictionary();
  util = new Utilities();
  dataValue = [];
  //CHECK PAGE
  pageFavorite: boolean;
  userId: any;
  getpage: string;
  noData: boolean;
  dataSidebar = [];
  selectlabels: string;
  notFound = false;

  // DICTIONARY VARIABLES ---
  dictNotFoundForTags: string;
  // ---

  constructor(
    private fsService: FileSharingService,
    private route: ActivatedRoute,
    private router: Router,
    private searchbarService: SearchbarService
    ) {

    // DICTIONARY VARIABLES ---
    this.dictNotFoundForTags = this.dict.getDictionary('not_found_for_tags');
    // ---
  }

  ngOnInit() {
    this.fsService.getListLabels().subscribe((result: any) => {
      let response = result.body.multistatus.response;

      if(response){
        this.noData = false;
        this.dataValue = [];
        this.dataSidebar = this.util.getLabelsList(response);
        this.dataValue.sort((a, b) => (a.name < b.name) ? 1 : -1);
      }else{
        this.noData = true;
      }
    });
    this.pageFavorite = false;
    this.getpage = 'labels';
    this.selectlabels = this.dict.getDictionary('select_a_label');

    // Subscription for searchbar submit event in header component
    this.searchbarService.labelsSubmitted$.subscribe( submitData => {
      const labels: any[] = submitData;

      let labelIds = '';
      for (const label of labels) {
        labelIds = (labels.indexOf(label) === (labels.length - 1)) ? (labelIds + label.id) : (labelIds + label.id + ',');
      }

      this.fsService.getFilesByTags(labelIds).subscribe( result => {

        let data = (result.body.multistatus) ? result.body.multistatus.response : null;

        if (data && data.length === undefined) {
          const tmp: any[] = [];
          tmp.push(data);
          data = tmp;
        }
        const username = sessionStorage.getItem('user');

        if (data) {
          this.noData = false;
          this.notFound = false;
          this.dataValue = this.util.getResponseLabels(data, username, false);
          this.dataValue.sort((a, b) => (a.name < b.name) ? 1 : -1);
        } else {
          this.noData = false;
          this.notFound = true;
        }
      });
    });
  }

}
