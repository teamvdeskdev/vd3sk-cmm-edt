import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { registerLocaleData } from '@angular/common';


@Component({
  selector: 'app-activity-table',
  templateUrl: './activity-table.component.html',
  styleUrls: ['./activity-table.component.scss']
})
export class ActivityTableComponent implements OnInit {

  @Input() dataValue;
  displayedColumns: string[] = ['id', 'profile_pic', 'image', 'description', 'icons', 'time'];
  dataSource: MatTableDataSource<any>;

  constructor() {
  }

  ngOnInit() {
    this.dataSource = this.dataValue;
  }

}

