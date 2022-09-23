import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Dictionary } from '../../dictionary/dictionary';
import { Utilities, FileSharingData } from '../../utilities';
import { __importDefault } from 'tslib';
import { FileSharingService } from '../../services/file-sharing.service';
import { Router, RouterModule } from '@angular/router';
import { SidebarService, SidebarTableService } from '../../services/sidebar.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AudioVideoComponent } from '../dialogs/audio-video/audio-video.component';
import { DialogPdfComponent } from '../dialogs/dialog-pdf/dialog-pdf.component';
import { DataSharingService } from 'src/app/app-services/data-sharing.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-search-result-table',
  templateUrl: './search-result-table.component.html',
  styleUrls: ['./search-result-table.component.scss']
})
export class SearchResultTableComponent implements OnInit, OnChanges {

  /* @Input, @Output */
  @Input() dataValue;
  @Input() pageFavorite: boolean;
  @ViewChild(MatSort) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  /* Others data value */
  dict = new Dictionary();
  util = new Utilities();
  dictResultsFound;
  data: any;
  getAllContent: string;
  user: string;
  isLoading: boolean = false;

  static utilStatic = new Utilities();
  static fsServiceStatic;
  /* For upload file count - loading image*/
  static uploadCount = 1;

  displayedColumns: string[] = ['id', 'image', 'name', 'url'];
  dataSource: MatTableDataSource<FileSharingData>;
  static dataSourceStatic;
  selection = new SelectionModel<FileSharingData>(true, []);

  constructor(
    private fsService: FileSharingService,
    private router: Router,
    private SidebarService : SidebarService,
    private SidebarTableService: SidebarTableService,
    private dialog: MatDialog,
    private dataSharingService: DataSharingService,
    private _spinner: NgxSpinnerService,
  ) {

    this.dictResultsFound = this.dict.getDictionary('results_found_in');

    this.user = sessionStorage.getItem('user');

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    SearchResultTableComponent.fsServiceStatic = fsService;

    this.SidebarTableService.change.subscribe(data => {
      if (data.type === 'delete') {
        this.receiveIdDelete(data.id);
      } else if (data.type === 'rename') {
        this.receiveIdRename(data.id);
      } else if (data.type === 'favorite') {
        this.receiveIdToggleFavorite(data.id);
      } else if (data.type === 'row') {
        this.receiveIdToggleRow();
      } else if (data.type === 'copy') {
        if(Array.isArray(data.info)) this.getCopyFile(data.info);
        else {
          let string = {
            path: data.info.path,
            name: data.info.name,
            exte: data.info.extension
          }
          this.getCopyFile(string);
        }
      }

    });
  }

  ngOnInit() {
    if (this.dataValue.length > 0 && this.dataValue) {
      this.data = this.dataValue;
    } else {
      this.data = [];
    }

    this.dataSource = SearchResultTableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
    this.dataSource.data = this.data;
    this.getAllContent = this.getContentString();
  }

  showLoader(){
    this.isLoading = true;
    this._spinner.show();
  }

  hideLoader(){
    this._spinner.hide();
    this.isLoading = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.ngOnInit();
  }

  /** CHANGE NAME
   * Event : on click send data to save new name
   * TO DO: call service on done
   * @param name
   * @param id
   */
  changeName(id:number, newvalue: string) {
    for(let i in this.data){
      if(this.data[i].id == id && this.data[i].name != newvalue){
        let source = ((this.data[i].path=='/')?'' : this.data[i].path) + this.data[i].name + this.data[i].extension;
        let destination = ((this.data[i].path=='/')?'' : this.data[i].path) + newvalue + this.data[i].extension;
        this.fsService.renameFileFolder(source, destination).subscribe((result: any) => {
          this.data[i].name = newvalue;
          this.data[i].rename = !this.data[i].rename;
          this.SidebarService.toggle(this.data[i], id, 'search');
        });
        break;
      }
    }
  }

  /** CHECK NAME FILE/FOLDER CLICK **/
  onNameClick(element: any) {
    if (element.file) {
      if(this.util.allData.video.includes(element.extension) || this.util.allData.audio.includes(element.extension) ||
      this.util.allData.image.includes(element.extension)){
        this.openDialogAudioVideo(element);
      }else if(this.util.allData.pdf.includes(element.extension)){
        this.showLoader()
        let uri = element.path + ((element.realname)? element.realname : element.name) + element.extension;
        this.fsService.getBody(uri).subscribe((result: any) => {
          var reader = new FileReader();
          reader.readAsDataURL(result.body);
          reader.onloadend = function () {
            return reader.result;
          }

          var interval = setInterval(function(){
            if(reader.result){
              this.hideLoader();
              clearInterval(interval);
              this.openDialogPdf(element, reader.result);
            }
          }.bind(this), 1000);

        });
      } else if (this.util.allData.text.includes(element.extension) || this.util.allData.spredsheet.includes(element.extension) ||
        this.util.allData.powerpoint.includes(element.extension) || this.util.allData.richtext.includes(element.extension)) {
          let name = ((element.realname)? element.realname : element.name) + element.extension;
          let FilePath = element.path + ((element.realname)? element.realname : element.name) + element.extension;
          this.openOnlyOffice(element.id, name, FilePath);
      }

    } else {
      let completeName, arrayComplete = '';
      if (element.path.length > 0 && element.path != '/') {
        let testArray = element.path.split('/');
        for (let i in testArray) {
          if (testArray[i].length == 0)
            testArray.splice(i, 1);
        }
        //if(testArray[testArray.length - 1] == element.name) testArray.splice(testArray.length - 1, 1);
        arrayComplete = testArray.join('/');
      }

      completeName = arrayComplete + ((arrayComplete.length > 0) ? '/' : '') + element.name;
      this.openFolder(completeName);
    }
  }

  /** OPEN ONLY OFFICE
   * Open file in new blank page 
   * @param id (number)
   * @param name (string) name and extension
   */
   openOnlyOffice(id: number, name: string, FilePath?: string){
    const fullName =  (FilePath) ? '%252F' + FilePath.replace(/\//g, '%252F') : name;
    let navigate = this.router.serializeUrl(
      this.router.createUrlTree([`/onlyoffice/${'id=' + id + '&name=' + fullName + '&shareToken='}`])
    );
    const fileTab = window.open(navigate, '_blank');

    if (FilePath !== undefined) {
      // Track the file update in log collector
      const updateCheckInterval = setInterval(async function() {
        if (fileTab.closed) {
          let TimeTabCLosed = await this.fsService.getTimeClosed().toPromise();
          setTimeout( async() => {
            let waitService = await this.fsService.getAllFiles(FilePath).toPromise();
            if(waitService.status == 200) {
              let getLastModified = waitService.body.multistatus.response.propstat[0].prop.getlastmodified;
              if(getLastModified) {
                let TimeNow = TimeTabCLosed.timestamp * 1000;
                let dataReal = new Date(getLastModified).getTime();
                var compreso = dataReal >= (TimeNow - 15000) && dataReal <= (TimeNow + 15000);
                if(compreso) {
                  this.fsService.trackFileUpdate(FilePath).subscribe((result: any) => {
                  });
                }
              }
            }
          }, 15000);
          clearInterval(updateCheckInterval);
        }
      }.bind(this), 5000);
    }
  }

  /** OPEN DIALOG AUDIO-VIDEO FILE **/
openDialogAudioVideo(data): void {
  this.showLoader();  
  this.fsService.getUrl(data).subscribe((result: any) => {
      const dialogRef = this.dialog.open(AudioVideoComponent, {
        width: '60%',
        height: '60%',
        data: {data: data, href: result}
      });

    dialogRef.afterClosed().subscribe(result => {});
    this.hideLoader();
  });
}

/** OPEN DIALOG PDF **/
openDialogPdf(data, base) {
  const dialogRef = this.dialog.open(DialogPdfComponent, {
    width: '70%',
    height: '85%',
    data: { data: data, base: base }
  });

  dialogRef.afterClosed().subscribe(result => {

  });
}

  /** OPEN FOLDER
   * Get element name and file on click
   * Call service files to get content
   * @param name
   * @param file
   */
  openFolder(name) {
    let path = 'all-files';

    this.dataSharingService.changePath(name);
    name = name.replace(/\//g, '%252F');
    this.router.navigate(['filesharing', 'folder', name], { queryParams: { name: name, home: path } }).finally( () => {
      this.dataSharingService.changePath(name);
    });
    SearchResultTableComponent.dataSourceStatic.data = [];
  }

  getContentString() {
    let archives = 0; let folders = 0; let files = 0;
    for (const item of this.data) {
      archives = (item.type === 'archives') ? archives+1 : archives;
      folders = (!item.file) ? folders+1 : folders;
      files = (item.file) ? files+1 : files;
    }
    const msg = 'di cui ' + archives + ' archiviazioni esterne, ' +
                folders + ' cartelle e ' +
                files + ' file';
    return msg;
  }


  /********************************************************/
  /** FUNCTIONS OR OUTPUT FUNCTION FROM SIDEBAR (START) ***/
  /********************************************************/

  receiveIdToggleRow(){
    this.selection.clear();
  }

  /** RECEIVE ID DELETE
   * Get element id from sidebar after event delete
   * Hide element with boolean
   * Close list settings on done
   */
  receiveIdDelete($event) {
    this.data.forEach(element => {
      if (element.id == $event) {
        element.hide = !element.hide;
      }
    });
  }

  /** RECEIVE ID RENAME
   * Get element id from sidebar after event rename
   * Show rename input on table
   * Close list setting on done
   */
  receiveIdRename($event) {
    this.data.forEach(element => {
      if (element.id == $event) {
        element.rename = !element.rename;
      }
    });
  }

  /** RECEIVE ID TOGGLE FAVORITE
   * Get element id from sidebar after event favorite
   * Hide element with boolean
   * Close list settings on done
   */
  receiveIdToggleFavorite($event) {
    this.data.forEach(element => {
      if (element.id == $event) {
        element.favorite = !element.favorite;
        if(this.pageFavorite) element.hide = !element.hide;
      }
    });
  }


  /** RECEIVE ID DETAILS
   * Get element id from child after event open details
   * Open side bar with details
   * Close list setting on done
   */
  receiveIdDetails($event){
    for(let i in this.data){
      if(this.data[i].id == $event){
        this.SidebarService.toggle(this.data[i], $event, 'search');
        break;
      }
    }
  }

  getCopyFile(val){
    if(Array.isArray(val)){
      for(var a=0; a<val.length; a++){
        let count = 1;
        for(var b in this.data){
          if((this.data[b].name.includes(val[a].name) && this.data[b].name.includes('(copy')) && this.data[b].extension == val[a].extension){
            count = count + 1;
          }
        }
        let source = val[a].path + val[a].name + val[a].extension;
        let destination = val[a].path + val[a].name + ' (copy '+ count +')' + val[a].extension;
        this.fsService.copyFile(source, destination).subscribe((result: any) => { });

        if(a == val.length-1) location.reload();
      }
    }else{
      let count = 1
      for(var i in this.data){
        if((this.data[i].name.includes(val.name) && this.data[i].name.includes('(copy')) && this.data[i].extension == val.exte){
          count = count + 1;
        }
      }

      let source = val.path + val.name + val.exte;
      let destination = val.path + val.name + ' (copy '+ count +')' + val.exte;
      this.fsService.copyFile(source, destination).subscribe((result: any) => {
        if(result.status=='success'){
          location.reload();
        } 
      });
    }

  }
  /********************************************************/
  /*** FUNCTIONS OR OUTPUT FUNCTION FROM SIDEBAR (END)   **/
  /********************************************************/
}

