import { Component, OnInit, ViewChild, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { FileSharingService } from '../../services/file-sharing.service';
import { Dictionary } from '../../dictionary/dictionary';
import { Utilities } from '../../utilities';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit, OnChanges {
  @Input() activity: any = {};
  dict = new Dictionary();
  util = new Utilities();  
  data = [];
  title: string = this.dict.getDictionary('activity_file');
  checknodata: boolean;
  nodata: boolean;
  empty: string = this.dict.getDictionary('no_activity');

  constructor(
    private fsService: FileSharingService,
  ) { }

  ngOnInit() {
    this.checknodata = (typeof this.nodata!=='undefined')? true : false;

    let id = this.activity.id;
    this.fsService.getActivityList(id).subscribe((result: any) => {
      if(result.status==304){
        this.nodata = true;
        this.checknodata = (typeof this.nodata!=='undefined')? true : false;
      }else{
        if(!result.body.ocs.data || result.body.ocs.data.length<=0){
          this.nodata = true;
          this.checknodata = (typeof this.nodata!=='undefined')? true : false;
        }else{
          this.data = this.util.getResultActivitySide(result.body.ocs.data);
          this.nodata =(this.data.length>0)? false : true;
          this.checknodata = (typeof this.nodata!=='undefined')? true : false;
        }
      }      
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const activity = changes.activity;
    if (activity.previousValue && activity.previousValue != activity.currentValue) {
      this.ngOnInit();
    }
  }

}
