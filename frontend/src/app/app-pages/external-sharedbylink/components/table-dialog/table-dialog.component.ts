import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Utilities, PublicData } from 'src/app/file-sharing/utilities';
import { __importDefault } from 'tslib';
import { FileSharingService } from 'src/app/file-sharing/services/file-sharing.service';
import { Router, RouterModule } from '@angular/router';
import { LanguageService } from 'src/app/app-services/language.service';

@Component({
  selector: 'app-table-dialog',
  templateUrl: './table-dialog.component.html',
  styleUrls: ['./table-dialog.component.scss']
})
export class TableDialogComponent implements OnInit {
/* @Input, @Output */
@Input() dataValue;
@Input() pageFavorite: boolean;
@Output() change: EventEmitter<any> = new EventEmitter();
@Output() create: EventEmitter<any> = new EventEmitter();
@ViewChild(MatSort) set content(sort: MatSort) {
  this.dataSource.sort = sort;
}

/* Others data value */
util = new Utilities();
data: any;
getAllContent: string;
user: string;

static isLoadingStatic: boolean;
static utilStatic = new Utilities();
static fsServiceStatic;
/* For upload file count - loading image*/
static uploadCount = 1;

displayedColumns: string[] = ['id', 'image', 'name', 'dateFunc', 'weight'];
dataSource: MatTableDataSource<PublicData>;
static dataSourceStatic;
selection = new SelectionModel<PublicData>(true, []);

constructor(
  private fsService: FileSharingService,
  private router: Router,
  public langService: LanguageService
) {
  this.user = sessionStorage.getItem('user');

  this.router.routeReuseStrategy.shouldReuseRoute = function () {
    return false;
  };
  TableDialogComponent.fsServiceStatic = fsService;
}

ngOnInit() {

  if (this.dataValue.length > 0 && this.dataValue) {
    this.data = this.dataValue;
  } else {
    this.data = [];
  }

  this.dataSource = TableDialogComponent.dataSourceStatic = new MatTableDataSource<PublicData>();
  this.dataSource.data = this.data;
}

navigateFolder($event){
  this.change.emit($event);
}

ngOnChanges(changes: SimpleChanges) {
  const activity = changes.dataValue;
  if (activity.currentValue.length>0) {
    this.ngOnInit();
  }
}

}
