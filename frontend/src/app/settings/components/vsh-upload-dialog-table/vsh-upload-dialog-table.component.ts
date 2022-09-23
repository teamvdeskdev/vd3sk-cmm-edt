import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Dictionary } from '../../../file-sharing/dictionary/dictionary';
import { Utilities, FileSharingData } from '../../../file-sharing/utilities';
import { __importDefault } from 'tslib';
import { FileSharingService } from '../../../file-sharing/services/file-sharing.service';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-vsh-upload-dialog-table',
  templateUrl: './vsh-upload-dialog-table.component.html',
  styleUrls: ['./vsh-upload-dialog-table.component.scss']
})
export class VshUploadDialogTableComponent implements OnInit, OnChanges {

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
  name: string;
  fileweight: string;
  lastupdate: string;
  getAllContent: string;
  dictLabelShared: string;
  user: string;

  displayedColumns: string[] = ['id', 'image', 'name', 'dateFunc', 'weight'];
  dataSource: MatTableDataSource<FileSharingData>;
  // static dataSourceStatic;
  selection = new SelectionModel<FileSharingData>(true, []);

  constructor(
    private fsService: FileSharingService,
    private router: Router,
  ) {
    this.user = sessionStorage.getItem('user');

    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }

  ngOnInit() {
    this.name = this.dict.getDictionary('name');
    this.fileweight = this.dict.getDictionary('size');
    this.lastupdate = this.dict.getDictionary('last_update');
    this.dictLabelShared = this.dict.getDictionary('label_shared');

    if (this.dataValue.length > 0 && this.dataValue) {
      this.data = this.dataValue;
    } else {
      this.data = [];
    }

    // this.dataSource = DialogTableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
    this.dataSource = new MatTableDataSource<FileSharingData>();
    this.dataSource.data = this.data;
  }

  navigateFolder($event){
    let data = {
      isfile: $event.file,
      extension: $event.extension,
      name: $event.name,
      path: $event.path,
    }
    this.change.emit(data);
  }

  ngOnChanges(changes: SimpleChanges) {
    const activity = changes.dataValue;
    if (activity.currentValue.length > 0) {
      this.ngOnInit();
    }
  }

}

