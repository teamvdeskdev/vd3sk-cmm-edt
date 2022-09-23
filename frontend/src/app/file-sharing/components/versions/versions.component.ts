import { Component, OnInit, ViewChild, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { DialogDeleteFileComponent } from '../dialogs/delete-file/delete-file.component';
import { FileSharingService } from '../../services/file-sharing.service';
import { Dictionary } from '../../dictionary/dictionary';
import { Utilities } from '../../utilities';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-versions',
  templateUrl: './versions.component.html',
  styleUrls: ['./versions.component.scss']
})
export class VersionsComponent implements OnInit, OnChanges {
  @Input() info;
  dict = new Dictionary();
  util = new Utilities();
  title: string = this.dict.getDictionary('file_versions');
  nodata: boolean;
  checknodata: boolean;
  nodatastring: string = this.dict.getDictionary('no_versions');
  restoredialogString: string = this.dict.getDictionary('restore_version_dialog_file');
  restoredialogResponse: string;
  data = [];

  constructor(
    private fsService: FileSharingService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.checknodata = (typeof this.nodata!=='undefined')? true : false;
    let id = this.info.id;
    this.getVersions(id);    
  }

  async getVersions(id: number){
    let getVersion = await this.fsService.getVersionFileFolder(id).toPromise();
    if('response' in getVersion.body.multistatus){
      let sendResponse = (Array.isArray(getVersion.body.multistatus.response))? getVersion.body.multistatus.response : [getVersion.body.multistatus.response]
      this.data = this.util.getResultVersionsSide(sendResponse);
      this.nodata = (this.data.length>0)? false : true;
      this.checknodata = (typeof this.nodata!=='undefined')? true : false;
    }else{
      this.nodata = true;
      this.checknodata = (typeof this.nodata!=='undefined')? true : false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const info = changes.info;
    if (info.previousValue && info.previousValue != info.currentValue) {
      this.ngOnInit();
    }
  }

  /** FUNCT DOWNLOAD
   * @param url href (string) of the file version
   * Download the file
   **/
  functDownload(url: string){
    this.fsService.download(url, this.info.name, this.info.extension, 'downloadversion');
  }

  /** FUNCT RESTORE **/
  functRestore(url: string){
    this.fsService.restoreVersionFileFolder(url).subscribe((result: any) => {
      this.ngOnInit()
    });
  }

  //----------------------------------------//
 //--------------- DIALOGS ----------------//
//----------------------------------------//

  /** OPEN DIALOG ON DELETE FILE/FOLDER **/
  openDialogRestore($event): void {
    const dialogRef = this.dialog.open(DialogDeleteFileComponent, {
      width: '20%',
      height: '18%',
      data: {string: this.restoredialogString, result: this.restoredialogResponse}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.restoredialogResponse = result;
      if(this.restoredialogResponse){
        this.functRestore($event);
      }
    });
  }

  //\\----------------------------------------//\\

}
