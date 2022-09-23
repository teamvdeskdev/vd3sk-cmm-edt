import { Component, OnInit, Input } from '@angular/core';
import { Dictionary } from '../../dictionary/dictionary';

@Component({
  selector: 'app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss']
})
export class NoDataComponent implements OnInit {

  @Input() page: string;
  dict = new Dictionary();
  nodataiconpage;
  nodatatitle;
  nodatadescription;
  noDataDescActivity: string = this.dict.getDictionary('nodata_desc_activity');
  noDataDescSearch: string = this.dict.getDictionary('nodata_desc_search');
  

  constructor() { }

  ngOnInit() {
    this.nodataiconpage = this.getIcon(this.page);
    if (this.page !== 'search') {
      this.nodatatitle = this.dict.getDictionary('nodata_title');
    }
    this.nodatadescription = this.dict.getDictionary(this.page + '_nodata_desc');
  }

  getIcon(val: string){
    let result;
    if(val=='all-files')              result = 'folder';
    else if(val=='recents')           result = 'access_time';
    else if(val=='favorites')         result = 'star';
    else if(val=='deleted')           result = 'delete';
    else if(val=='protected')         result = 'lock';
    else if(val=='attachmentsvpec')   result = 'attachment';
    else if(val=='externalarchives')  result = 'dns';
    else if(val=='groupfolder')       result = 'folder_shared';    
    else if(val=='vflow')             result = 'forward';
    else if(val=='signed')            result = 'gesture';
    
    else if(val=='activity')          result = 'flash_on';
    else if(val=='search-result')     result = 'search';

    return result;
  }

}
