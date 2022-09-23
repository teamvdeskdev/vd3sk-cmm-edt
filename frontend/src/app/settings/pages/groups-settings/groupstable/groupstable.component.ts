import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { settingsUser } from 'src/app/file-sharing/utilities';
import { FileSharingService } from 'src/app/file-sharing/services/file-sharing.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { LanguageService } from 'src/app/settings/services/language.service';

@Component({
  selector: 'app-groupstable',
  templateUrl: './groupstable.component.html',
  styleUrls: ['./groupstable.component.scss']
})
export class GroupstableComponent implements OnInit {
  quotaList: any = [];
  isdata: boolean = true;
  noUser: boolean = false;

  @Input() data: any;
  @Output() deletegroup: EventEmitter<any> = new EventEmitter();
  @ViewChild(MatSort) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  dataSource: MatTableDataSource<settingsUser>;
  static dataSourceStatic;
  displayedColumns: string[] = ['id', 'image', 'name', 'users', 'admin', 'actions', 'navigate'];

  constructor(
    private spinner: NgxSpinnerService,
    private _snackBar: MatSnackBar,
    private router: Router,
    public langService: LanguageService
  ) { }

  ngOnInit() {
    this.dataSource = GroupstableComponent.dataSourceStatic = new MatTableDataSource<settingsUser>();
    this.dataSource.data = this.data;
  }

  showLoader(){
    this.isdata = false;
    this.spinner.show();
  }

  groupDelete(element: any){
    this.showLoader();
    this.deletegroup.emit(element);
  }

  navigateGroup(element: any){
    this.showLoader();
    this.router.navigate(['settings/groups-settings/users', element.id], { });
  }

  ngOnChanges(changes: SimpleChanges) {
    let data = changes.data;
    if((data && data.previousValue) && JSON.stringify(data.currentValue) != JSON.stringify(data.previousValue)){
      this.dataSource.data = data.currentValue;
    }
  }

}
