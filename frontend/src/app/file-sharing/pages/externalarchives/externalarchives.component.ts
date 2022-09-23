import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileSharingService } from '../../services/file-sharing.service';
import { Utilities, ArchivesData } from '../../utilities';
import { NgxSpinnerService } from 'ngx-spinner';
import { GroupFolderButton } from 'src/app/file-sharing/services/sidebar.service';

@Component({
  selector: 'app-externalarchives',
  templateUrl: './externalarchives.component.html',
  styleUrls: ['./externalarchives.component.scss']
})
export class ExternalarchivesComponent implements OnInit {
  util = new Utilities();
  pageFavorite: boolean = false;
  getpage: string = 'externalarchives';
  noData: boolean;
  dataValue: ArchivesData[] = [];
  isfolder: boolean;
  done: boolean = false;

  constructor(
    private fsService: FileSharingService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private sendButton: GroupFolderButton,
  ) { }

  ngOnInit() {
    this.sendButton.toggle(true);
    this.spinner.show();
    this.fsService.getExternalArchives().subscribe((result: any) => {
      let response = result.body.ocs.data;

      if((response && Array.isArray(response)) && response.length>0){
        this.noData = false;
        this.dataValue = this.util.getResponseExternalArchives(response);
        this.dataValue.sort((a, b) => (a.name < b.name) ? 1 : -1);
      }else{
        this.noData = true;
      }

      this.spinner.hide();
      this.done = true;
    });
    
    this.isfolder = false;
  }

}
