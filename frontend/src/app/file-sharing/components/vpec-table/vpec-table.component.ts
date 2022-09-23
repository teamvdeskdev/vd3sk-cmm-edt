import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Dictionary } from '../../dictionary/dictionary';
import { Utilities, FileSharingData } from '../../utilities';
import { __importDefault } from 'tslib';
import { FileSharingService } from '../../services/file-sharing.service';
import { Router, RouterModule } from '@angular/router';
import { SidebarService, SidebarTableService } from '../../services/sidebar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AudioVideoComponent } from '../dialogs/audio-video/audio-video.component';
import { DialogPdfComponent } from '../dialogs/dialog-pdf/dialog-pdf.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataSharingService } from 'src/app/app-services/data-sharing.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vpec-table',
  templateUrl: './vpec-table.component.html',
  styleUrls: ['./vpec-table.component.scss']
})
export class VpecTableComponent implements OnInit {
  /* @Input, @Output */
  @Input() dataValue;
  @Input() pageFavorite: boolean;
  @Output() deletemail: EventEmitter<any> = new EventEmitter();
  @ViewChild(MatSort) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  /* Others data value */
  dict = new Dictionary();
  util = new Utilities();
  data: any;
  getAllContent: string;
  user: string;
  selectedid: number;
  done: boolean = false;
  unsubscribeLater: Subscription;

  //Dictionary
  name = this.dict.getDictionary('name');
  fileweight = this.dict.getDictionary('size');
  lastupdate = this.dict.getDictionary('last_update');
  dictLabelShared = this.dict.getDictionary('label_shared');
  copySuccess: string = this.dict.getDictionary('copy_done');
  copyUnSuccess: string = this.dict.getDictionary('copy_not_done');

  static isLoadingStatic: boolean;
  static spinnerStatic;
  static utilStatic = new Utilities();
  static fsServiceStatic;
  static routerStatic;
  static uploadCount = 1;
  displayedColumns: string[];
  dataSource: MatTableDataSource<FileSharingData>;
  static dataSourceStatic;
  selection = new SelectionModel<FileSharingData>(true, []);

  constructor(
    private fsService: FileSharingService,
    private router: Router,
    private SidebarService : SidebarService,
    private SidebarTableService: SidebarTableService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private dataSharingService: DataSharingService,
    private _snackBar: MatSnackBar,
  ) {

    this.user = sessionStorage.getItem('user');

    /*
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    */

    VpecTableComponent.fsServiceStatic = fsService;
    VpecTableComponent.spinnerStatic = spinner;
    VpecTableComponent.isLoadingStatic = this.done;
    VpecTableComponent.routerStatic = router;

    this.unsubscribeLater = this.SidebarTableService.change.subscribe(data => {
      if (data.type == 'delete') {
        this.receiveIdDelete(data.id);
      } else if (data.type == 'rename') {
        this.receiveIdRename(data.id);
      } else if (data.type == 'favorite') {
        this.receiveIdToggleFavorite(data.id);
      } else if (data.type == 'row') {
        this.receiveIdToggleRow();
      } else if (data.type == 'copy') {
        if (Array.isArray(data.info)) this.getCopyFile(data.info, data.others);
        else {
          let string = {
            path: data.info.homepath,
            name: data.info.realname,
            exte: data.info.extension
          }
          this.getCopyFile(string, data.others);
        }
      }

    });
  }

  ngOnInit() {
    let url = decodeURIComponent(this.router.url)
    if(url.includes('/filesharing/folder/')) this.displayedColumns = ['select', 'id', /*'image',*/ 'name', 'dateFunc', 'weight', 'senddetails'];
    else this.displayedColumns = ['id', /*'image',*/ 'name', 'dateFunc', 'weight', 'configMail'];

    if (this.dataValue.length > 0 && this.dataValue) {
      this.data = this.dataValue;
    } else {
      this.data = [];
    }

    this.dataSource = VpecTableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
    this.dataSource.data = this.data;
    this.getAllContent = this.getContentString();
  }

  ngOnChanges(changes: SimpleChanges) {
    const activity = changes.dataValue;
    if (activity.currentValue.length>0) {
      this.ngOnInit();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    let array = [];
    if(this.isAllSelected()){
      this.dataSource.data.forEach(row => { row.isRow = false; });
      this.SidebarService.toggle(array, null, 'vpec');
      this.selection.clear();
    }else{
      this.dataSource.data.forEach(row => {
        if(!row.isRow) row.isRow = !row.isRow;
        array.push(row);
        this.selection.select(row);
      });
      this.SidebarService.toggle(array, null, 'vpec');
    }
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: FileSharingData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  /** ON SELECT ROW
   * On select row send multiple data to sidebar
   *  Id is null on toggle (second value)
   **/
  onSelectRow($event, row){
    this.clearRowAll();
    row.isRow = (this.selection.isSelected(row))? false : true;
    this.SidebarService.toggle(row, null, 'vpec');
    return `${$event ? this.selection.toggle(row) : null}`;
  }

  /** CLEAR ROW ALL
   * Clear al row on changes check/no
   **/
  clearRowAll(){
    for(let i in this.data){
      if(this.data[i].isRow){
        this.data[i].isRow = false;
        break;
      }
    }
  }

  /** OPEN FOLDER
   * Get element name and file on click
   * Call service files to get content
   */
  openFolder(element: any) {
    if(!element.isfile){
      let url = decodeURIComponent(this.router.url);
      if(url.includes('/filesharing/folder/')){
          let check = '/filesharing/folder/';
          let index = url.indexOf(check);
          let pathvalue = url.slice(index + check.length);
          let home = '&home=';
          let path = pathvalue.slice((pathvalue.indexOf(home) + home.length));
          let name = element.homepath + element.name;
          this.dataSharingService.changePath(name);
          name = name.replace(/\//g, '%252F');
          this.router.navigate(['filesharing', 'folder', name], { queryParams: { name: name, home: path } }).finally( () => {
            this.dataSharingService.changePath(name);
          });
          // VpecTableComponent.dataSourceStatic.data = [];
      }else{
          let check = '/filesharing/';
          let index = url.indexOf(check);
          let path = url.slice(index + check.length);
          let name = element.homepath + element.name;
          this.dataSharingService.changePath(name);
          name = name.replace(/\//g, '%252F');
          this.router.navigate(['filesharing', 'folder', name], { queryParams: { name: name, home: path } }).finally( () => {
            this.dataSharingService.changePath(name);
          });
          // VpecTableComponent.dataSourceStatic.data = [];
      }
    }else{
      if(this.util.allData.video.includes(element.extension) || this.util.allData.audio.includes(element.extension) ||
      this.util.allData.image.includes(element.extension)){
        this.openDialogAudioVideo(element);
      }else if(this.util.allData.pdf.includes(element.extension)){
        this.done = true;
        this.spinner.show();
        let uri = element.homepath + element.realname + element.extension;
        this.fsService.getBody(uri).subscribe((result: any) => {
          var reader = new FileReader();
          reader.readAsDataURL(result.body);
          reader.onloadend = function () {
            return reader.result;
          }

          var interval = setInterval(function(){
            if(reader.result){
              this.spinner.hide();
              this.done = false;
              clearInterval(interval);
              this.openDialogPdf(element, reader.result);
            }
          }.bind(this), 1000);

        });
      } else if (this.util.allData.text.includes(element.extension) || this.util.allData.spredsheet.includes(element.extension) ||
        this.util.allData.powerpoint.includes(element.extension) || this.util.allData.richtext.includes(element.extension)) {
        let FilePath = element.homepath + ((element.realname)? element.realname : element.name) + element.extension;
        this.openOnlyOffice(element, FilePath);
      }
    }
  }

  getCopyFile(val, others) {
    if (Array.isArray(val)) {
      for (var a = 0; a < val.length; a++) {
        let count = 1;
        for (var b in this.data) {
          if ((this.data[b].name.includes(val[a].name) && this.data[b].name.includes('(copy')) && this.data[b].extension == val[a].extension) {
            count = count + 1;
          }
        }

        let source = val[a].homepath + val[a].realname + val[a].extension;
        let name = val[a].name + ' (copy ' + count + ')' + val[a].extension
        let destination = others.destination + name;
        this.fsService.copyFile(source, destination).subscribe((result: any) => {
          if (result.status == 'success') {
            this._snackBar.open(this.copySuccess, '', {
              duration: 4000,
              panelClass: 'toast-success'
            });
          } else {
            this._snackBar.open(this.copyUnSuccess, '', {
              duration: 4000,
              panelClass: 'toast-error'
            });
          }
        });
      }
      //if (!others.destination || others.destination == '/') this.reload.emit('');
    } else {
      let count = 1
      for (var i in this.data) {
        if ((this.data[i].name.includes(val.name) && this.data[i].name.includes('(copy')) && this.data[i].extension == val.exte) {
          count = count + 1;
        }
      }

      let source = val.path + val.name + val.exte;
      let name;
      if(val.exte == '.ven'){
        let firstArray = val.name.split(']');
        let realExt = firstArray[1].split('.');
        name = realExt[0] + ' (copy ' + count + ').' + realExt[1] + val.exte; 
      }else name = val.name + ' (copy ' + count + ')' + val.exte;

      let destination = others.destination + name;
      this.fsService.copyFile(source, destination).subscribe((result: any) => {
        if (result.status == 'success') {
           this._snackBar.open(this.copySuccess, '', {
             duration: 4000,
             panelClass: 'toast-success'
           });
          //if (!others.destination || others.destination == '/') this.reload.emit('');
        } else {
          this._snackBar.open(this.copyUnSuccess, '', {
            duration: 4000,
            panelClass: 'toast-error'
          });
        }
      });
    }
  }

  openOnlyOffice(element: any, FilePath?: string) {
    let name = element.name + element.extension;
    const fullName =  (FilePath) ? '%252F' + FilePath.replace(/\//g, '%252F') : name;
    let navigate = this.router.serializeUrl(
      this.router.createUrlTree([`/onlyoffice/${'id=' + element.id + '&name=' + fullName + '&shareToken='}`])
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
    this.done = true;
    this.spinner.show();
    this.fsService.getUrl(data).subscribe((result: any) => {
        const dialogRef = this.dialog.open(AudioVideoComponent, {
          width: '60%',
          height: '60%',
          data: {data: data, href: result}
        });

      dialogRef.afterClosed().subscribe(result => {});
      
      this.spinner.hide();
      this.done = false;
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

  getContentString(){
    let folders=0, files=0, size=0;
    for(var i in this.data){
      folders = (!this.data[i].isfile)? folders+1 : folders;
      files = (this.data[i].isfile)? files+1 : files;
      size = (this.data[i].size>0)? (size + parseInt(this.data[i].size)) : size;
    }
    let string = folders + ' Cartelle e '+files+' Files - '+ this.util.getWeight(size) +' occupati';
    return string;
  }

  openShare($event) {
    for (const i in this.data) {
      if (this.data[i].id === $event) {
        const data = {info: this.data[i], tabToOpen: 'share'};
        this.SidebarService.toggle(data, $event, 'vpec');
        break;
      }
    }
  }

  deleteUnusedMail(element: any){
    this.done = true;
    this.spinner.show();
    this.deletemail.emit(element);
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
    for(var i in this.data){
      if (this.data[i].id == $event) {
        this.data[i].hide = !this.data[i].hide;
        if(this.selectedid){
          this.selectedid = null;
        }
        break;
      }
    }
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
    if (this.isAllSelected()) {
      this.dataSource.data.forEach(row => { row.isRow = false; });
      this.SidebarService.toggle([], null, 'allfiles');
      this.selection.clear();
    }

    this.clearRowAll();

    for(let i in this.data){
      if(this.data[i].id == $event){
        this.SidebarService.toggle(this.data[i], $event, 'vpec');
        this.selectedid = $event;
        this.data[i].isRow = true;
        break;
      }
    }
  }

  /********************************************************/
  /*** FUNCTIONS OR OUTPUT FUNCTION FROM SIDEBAR (END)   **/
  /********************************************************/

  ngOnDestroy(){
    this.dataSharingService.setFavoritesCardData(null);
    this.dataSharingService.setSharedFileId(null);
    if(this.unsubscribeLater) this.unsubscribeLater.unsubscribe();
  }
}
