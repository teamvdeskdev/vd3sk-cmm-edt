import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataSharingService } from 'src/app/app-services/data-sharing.service';
import { LogoService } from 'src/app/app-services/logo.service';

@Component({
  selector: 'app-vshare-favorites-table',
  templateUrl: './vshare-favorites-table.component.html',
  styleUrls: ['./vshare-favorites-table.component.scss']
})
export class VshareFavoritesTableComponent implements OnInit {

  /* @Input, @Output */
  @Input() set dataValue(value: any) {
    if (value && value.length > 0) {
      this.dataSource = value;
    }
  }
  displayedColumns: string[] = ['id', 'image', 'name', 'arrowColumn'];
  dataSource: MatTableDataSource<any>;

  constructor(
    private router: Router,
    private dataSharingService: DataSharingService,
    private spinner: NgxSpinnerService,
    private logoService: LogoService
    ) {}

  ngOnInit() {

  }

  openFolder(element: any) {
    this.dataSharingService.setFavoritesCardData(element);
    this.spinner.show();
    this.router.navigateByUrl('filesharing/favorites').finally(() => {
      this.spinner.hide();
    });
    this.logoService.onLauncherClick('vShare');
  }
}
