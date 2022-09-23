import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Dictionary } from '../../dictionary/dictionary';
import { Utilities, FileSharingData } from '../../utilities';
import { __importDefault } from 'tslib';
import { FileSharingService } from '../../services/file-sharing.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dialog-table',
  templateUrl: './dialog-table.component.html',
  styleUrls: ['./dialog-table.component.scss']
})

export class DialogTableComponent implements OnInit, OnChanges {
  /* @Input, @Output */
  @Input() dataValue;
  @Input() pageFavorite: boolean;
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() create: EventEmitter<any> = new EventEmitter();
  @ViewChild(MatSort) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  /* Others data value */
  dict = new Dictionary();
  util = new Utilities();
  data: any;
  name: string = this.dict.getDictionary('name');
  fileweight: string = this.dict.getDictionary('size');
  lastupdate: string = this.dict.getDictionary('last_update');
  dictLabelShared: string = this.dict.getDictionary('label_shared');
  getAllContent: string;
  user: string;

  static isLoadingStatic: boolean;
  static utilStatic = new Utilities();
  static fsServiceStatic;
  /* For upload file count - loading image*/
  static uploadCount = 1;

  displayedColumns: string[] = ['id', 'image', 'name', 'dateFunc', 'weight'];
  dataSource: MatTableDataSource<FileSharingData>;
  static dataSourceStatic;
  selection = new SelectionModel<FileSharingData>(true, []);

  constructor(
    private fsService: FileSharingService,
    private router: Router,
  ) {
    this.user = sessionStorage.getItem('user');

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    DialogTableComponent.fsServiceStatic = fsService;
  }

  ngOnInit() {

    if (this.dataValue.length > 0 && this.dataValue) {
      this.data = this.dataValue;
    } else {
      this.data = [];
    }

    this.dataSource = DialogTableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
    this.dataSource.data = this.data;
  }

  navigateFolder($event){
    this.change.emit($event);
  }

  ngOnChanges(changes: SimpleChanges) {
    const activity = changes.dataValue;
    if (activity.currentValue.length>0) {
      this.dataSource = DialogTableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
      this.dataSource.data = this.data;
    }
  }

}
