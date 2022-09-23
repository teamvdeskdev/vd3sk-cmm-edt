import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FileByTag, Utilities } from 'src/app/file-sharing/utilities';
import { Dictionary } from 'src/app/file-sharing/dictionary/dictionary';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-taglist',
  templateUrl: './taglist.component.html',
  styleUrls: ['./taglist.component.scss']
})
export class TaglistComponent implements OnInit {
  dictionary = new Dictionary();
  utility = new Utilities();
  getpage: string = 'labels';
  dataValue: any = [];
  newname: string;
  user = sessionStorage.getItem('user');

  //DICTIONARY
  name: string = this.dictionary.getDictionary('name');
  fileweight: string = this.dictionary.getDictionary('size');
  lastupdate: string = this.dictionary.getDictionary('last_update');
  errorName: string = this.dictionary.getDictionary('error_samename');

  @Input() data: any;
  @Output() send: EventEmitter<any> = new EventEmitter();
  @Output() rename: EventEmitter<any> = new EventEmitter();
  @ViewChild(MatSort) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  dataSource: MatTableDataSource<FileByTag>;
  static dataSourceStatic;
  displayedColumns: string[] = ['id', 'image', 'name', 'share', 'date', 'weight', 'sidebar'];

  constructor(
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.dataValue = this.data.fileList;
    this.dataSource = TaglistComponent.dataSourceStatic = new MatTableDataSource<FileByTag>();
    this.dataSource.data = this.dataValue;    
  }

  sendToSidebar(element: any){
    this.send.emit(element);
  }

  changeName(element: any){
    if(element.name != this.newname && this.newname.length>0){
      this.rename.emit({
        data: element,
        name: this.newname
      });
    }else{
      this._snackBar.open(this.errorName, '', {
        duration: 4000,
        panelClass: 'toast-error'
      });
    }
  }

}
