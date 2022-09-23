import { Component, OnInit, Input, ViewChild, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Dictionary } from '../../dictionary/dictionary';
import { FileSharingData, Utilities } from '../../utilities';
import { __importDefault } from 'tslib';
import { FileSharingService } from '../../services/file-sharing.service';
import { Router } from '@angular/router';
import { SidebarService, SidebarTableService } from '../../services/sidebar.service';
import { DialogPdfComponent } from '../dialogs/dialog-pdf/dialog-pdf.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DataSharingService } from 'src/app/app-services/data-sharing.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription } from 'rxjs';
import { RenameFileComponent } from '../dialogs/rename-file/rename-file.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AudioVideoComponent } from '../dialogs/audio-video/audio-video.component';

@Component({
  selector: 'app-shares-table',
  templateUrl: './shares-table.component.html',
  styleUrls: ['./shares-table.component.scss']
})
export class SharesTableComponent implements OnInit {

  /* @Input, @Output */
  @Input() dataValue;
  @Input() pageFavorite: boolean;
  @Input() getpage: string;
  @ViewChild(MatSort) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  /* Others data value */
  dict = new Dictionary();
  util = new Utilities();
  data: any;
  name: string;
  getAllContent: string;
  user: string;
  sidebarServices: Subscription;
  sortUpdate: boolean = false;

  static isLoadingStatic: boolean;
  static utilStatic = new Utilities();
  static fsServiceStatic;
  /* For upload file count - loading image*/
  static uploadCount = 1;

  // DICTIONARY VARIABLES ---
  dictLabelName: string = this.dict.getDictionary('label_name');
  dictLabelSharingTime: string = this.dict.getDictionary('label_sharing_time');
  dictLabelShared: string = this.dict.getDictionary('label_shared');
  dictShare: string = this.dict.getDictionary('tt_share');
  dictSharedWith: string = this.dict.getDictionary('tt_shared_with');
  dictSharedByLinkAndWith: string = this.dict.getDictionary('tt_shared_by_link_and_with');
  dictAnd: string = this.dict.getDictionary('tt_and');
  dictOtherPerson: string = this.dict.getDictionary('tt_other_person');
  dictOtherPeople: string = this.dict.getDictionary('tt_other_people');
  dictPeople: string = this.dict.getDictionary('tt_people');
  dictSharedByLink: string = this.dict.getDictionary('tt_shared_by_link');
  dictSharedBy: string = this.dict.getDictionary('tt_shared_by');
  copySuccess: string = this.dict.getDictionary('copy_done');
  //

  sharesDisplayedColumns: string[];
  dataSource: MatTableDataSource<FileSharingData>;
  static dataSourceStatic;
  selection = new SelectionModel<FileSharingData>(true, []);

  constructor(
    private fsService: FileSharingService,
    private router: Router,
    private sidebarService: SidebarService,
    private sidebarTableService: SidebarTableService,
    private dialog: MatDialog,
    private dataSharingService: DataSharingService,
    private _snackBar: MatSnackBar,
  ) {

    this.user = sessionStorage.getItem('user');
    SharesTableComponent.fsServiceStatic = fsService;

    this.sidebarServices = this.sidebarTableService.change.subscribe(data => {
      if(!data.info) this.receiveIdDelete(data.id);
      else if(data.type=='rename') this.receiveIdRename(data.id);
      else if(data.type=='favorite') this.receiveIdToggleFavorite(data.id);
      else if (data.type == 'copy') {
        if (Array.isArray(data.info)) this.getCopyFile(data.info, data.others);
        else {
          let string = {
            path: (data.info.homepath)? data.info.homepath : data.info.path,
            name: (data.info.realname)? data.info.realname : data.info.name,
            exte: data.info.extension
          }
          this.getCopyFile(string, data.others);
        }
      }
    });
  }

  ngOnInit() {
    if(['shared-by-you', 'shares', 'shared-by-others', 'shared-by-link'].includes(this.getpage)) this.sharesDisplayedColumns = ['id', 'image', 'name', 'share', 'dateFunc', 'senddetails'];
    else this.sharesDisplayedColumns = ['select', 'id', 'image', 'name', 'share', 'dateFunc', 'senddetails'];

    if (this.dataValue.length > 0 && this.dataValue) this.data = this.dataValue;
    else this.data = [];

    //this.dataSource = new MatTableDataSource<FileSharingData>();
    this.dataSource = SharesTableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
    this.dataSource.data = this.data;
    this.getAllContent = this.getContentString();
    console.log(this.dataSource.data);
  }

  showMessage(message: string, type: string){
    this._snackBar.open(message, '', {
      duration: 4000,
      panelClass: ('toast-' + type)
    });
  }

  /** SORT EVERYTHING
   * Sort table columns for type (name, size, date)
   * @param type : string
   **/
   sortEverything(type: string){
    if(this.sortUpdate){
      if(type=="name") this.dataValue.sort((a, b) => (b.name.toLowerCase() > a.name.toLowerCase()) ? 1 : -1);
      else if(type=="date") this.dataValue.sort((a, b) => (b.lastUpdate > a.lastUpdate) ? 1 : -1);
      else if(type=="size") this.dataValue.sort((a, b) => (parseInt(b.fileWeight) > parseInt(a.fileWeight)) ? 1 : -1);
      this.dataValue.sort((a, b) => (a.favorite < b.favorite) ? 1 : -1);
      this.dataSource = SharesTableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
      this.dataSource.data = this.dataValue;
      this.sortUpdate = !this.sortUpdate;
    }else{
      if(type=="name") this.dataValue.sort((a, b) => (b.name.toLowerCase() < a.name.toLowerCase()) ? 1 : -1);
      else if(type=="date") this.dataValue.sort((a, b) => (b.lastUpdate < a.lastUpdate) ? 1 : -1);
      else if(type=="size") this.dataValue.sort((a, b) => (parseInt(b.fileWeight) < parseInt(a.fileWeight)) ? 1 : -1);
      this.dataValue.sort((a, b) => (a.favorite < b.favorite) ? 1 : -1);
      this.dataSource = SharesTableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
      this.dataSource.data = this.dataValue;
      this.sortUpdate = !this.sortUpdate;
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
    if (this.isAllSelected()) {
      this.dataSource.data.forEach(row => { row.isRow = false; });
      this.sidebarService.toggle(array, null, 'shares');
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(row => {
        if(!row.isRow) row.isRow = !row.isRow;
        array.push(row);
        this.selection.select(row);
      });
      this.sidebarService.toggle(array, null, 'shares');
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
  onSelectRow($event, row) {
    this.clearRowAll();
    row.isRow = (this.selection.isSelected(row)) ? false : true;
    this.sidebarService.toggle(row, null, 'shares');
    return `${$event ? this.selection.toggle(row) : null}`;
  }

  /** CLEAR ROW ALL
   * Clear al row on changes check/no
   **/
  clearRowAll() {
    for (let i in this.data) {
      if (this.data[i].isRow) {
        this.data[i].isRow = false;
        break;
      }
    }
  }

  /** CHANGE NAME
   * Event : on click send data to save new name
   * TO DO: call service on done
   * @param id
   * @param newvalue
   */
  changeName(id: number, newvalue: string) {
    for (const i in this.data) {
      if (this.data[i].id === id && this.data[i].name !== newvalue) {
        const source = ((this.data[i].path === '/')?'' : this.data[i].path) + this.data[i].name + this.data[i].extension;
        const destination = ((this.data[i].path === '/')?'' : this.data[i].path) + newvalue + this.data[i].extension;
        this.fsService.renameFileFolder(source, destination).subscribe((result: any) => {
          this.showMessage(this.dict.getDictionary('rename_success'),'success');
          this.data[i].name = newvalue;
          this.data[i].rename = !this.data[i].rename;
          this.sidebarService.toggle(this.data[i], id, 'shares');
        });
        break;
      }
    }
  }

  /** CHECK NAME FILE/FOLDER CLICK **/
  onNameClick(element: any){
    if(element.file){

      if(this.util.allData.video.includes(element.extension) || this.util.allData.audio.includes(element.extension) || 
      this.util.allData.image.includes(element.extension)){
        this.openDialogAudioVideo(element);
      }else if(this.util.allData.pdf.includes(element.extension)){
        let uri = element.path + element.name + element.extension;
        this.fsService.getBody(uri).subscribe((result: any) => {
          var reader = new FileReader();
          reader.readAsDataURL(result.body);
          reader.onloadend = function(){
             return reader.result;
          }
          
          var interval = setInterval(function(){
            if(reader.result){
              clearInterval(interval);
              this.openDialogPdf(element, reader.result);
            }
          }.bind(this), 1000);

        });
      }else if(this.util.allData.text.includes(element.extension) || this.util.allData.spredsheet.includes(element.extension) ||
      this.util.allData.powerpoint.includes(element.extension) || this.util.allData.richtext.includes(element.extension)){
        let FilePath = element.path + ((element.realname)? element.realname : element.name) + element.extension;
        this.openOnlyOffice(element, FilePath);
      }

    }else{
      let completeName, arrayComplete = '';
      if(element.path.length>0 && element.path!='/'){
          let testArray = element.path.split('/');
          for(let i in testArray){
            if(testArray[i].length == 0)
              testArray.splice(i, 1);
          }
          if(testArray[testArray.length - 1] == element.name) testArray.splice(testArray.length - 1, 1);
          arrayComplete = testArray.join('/');
      }
      
      completeName = arrayComplete + ((arrayComplete.length>0)? '/' : '') + element.name;
      this.openFolder(completeName);
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

  /** OPEN DIALOG PDF **/
  openDialogPdf(data ,base){
    const dialogRef = this.dialog.open(DialogPdfComponent, {
      width: '70%',
      height: '85%',
      data: {data: data, base: base}
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  /** OPEN DIALOG AUDIO-VIDEO FILE **/
  openDialogAudioVideo(data): void {
    this.fsService.getUrl(data).subscribe((result: any) => {
      const dialogRef = this.dialog.open(AudioVideoComponent, {
        width: '60%',
        height: '60%',
        data: { data: data, href: result }
      });

      dialogRef.afterClosed().subscribe(result => { });
    });
  }

  /** OPEN FOLDER
   * Get element name and file on click
   * Call service files to get content
   * @param name
   * @param file
   */
  openFolder(name: string) {
    let url = decodeURIComponent(this.router.url);
    if (url.includes('/filesharing/folder/')) {
      let check = '/filesharing/folder/';
      let index = url.indexOf(check);
      let pathvalue = url.slice(index + check.length);
      let home = '&home=';
      let path = pathvalue.slice((pathvalue.indexOf(home) + home.length));
      this.dataSharingService.changePath(name);
      name = name.replace(/\//g, '%252F');
      this.router.navigate(['filesharing', 'folder', name], { queryParams: { name: name, home: path } }).finally( () => {
        this.dataSharingService.changePath(name);
      });
      SharesTableComponent.dataSourceStatic.data = [];
    } else {
      let check = '/filesharing/';
      let index = url.indexOf(check);
      let path = url.slice(index + check.length);
      this.dataSharingService.changePath(name);
      name = name.replace(/\//g, '%252F');
      this.router.navigate(['filesharing', 'folder', name], { queryParams: { name: name, home: path } }).finally( () => {
        this.dataSharingService.changePath(name);
      });
      SharesTableComponent.dataSourceStatic.data = [];
   }
  }

  getContentString(){
    let archives=0, folders=0, files=0, size=0;
    for(var i in this.dataValue){
      archives = (this.dataValue[i].type=='archives')? archives+1 : archives;
      folders = (!this.dataValue[i].file)? folders+1 : folders;
      files = (this.dataValue[i].file)? files+1 : files;
      size = (this.dataValue[i].fileWeight>0)? (size + parseInt(this.dataValue[i].fileWeight)) : size;
    }
    let string = archives + ' Archiviazioni esterne, ' +folders+ ' Cartelle e '+files+' Files - '+ this.util.getWeight(size) +' occupati';
    return string;
  }

  openShare($event) {
    this.dataSource.data.forEach(row => { row.isRow = false; });
    this.sidebarService.toggle([], null, 'allfiles');
    this.selection.clear();
    for (const i in this.data) {
      if (this.data[i].id === $event) {
        const data = {info: this.data[i], tabToOpen: 'share'};
        this.sidebarService.toggle(data, $event, 'shares');
        break;
      }
    }
  }

  /********************************************************/
  /** LIST FUNCTIONS OR OUTPUT FUNCTION FROM LIST (START) */
  /********************************************************/

  /** RECEIVE ID DELETE
   * Get element id from child after event delete
   * Hide element with boolean
   * Close list settings on done
   * TO DO: Call function delete file or folder
   */
  receiveIdDelete($event) {
    this.data.forEach(element => {
      if (element.id === $event) {
        var path = !! (element.path) ? element.path : '';
        this.fsService.delete(path + element.name + element.extension).subscribe((result: any) => {});
        element.hide = !element.hide;
      }
    });
  }

  /** RECEIVE ID DOWNLOAD
   * Get element id from child after download event
   * Close list settings on done
   */
  receiveIdDownload($event) {
    this.data.forEach(element => {
      if (element.id == $event) {

        var path = !! (element.path) ? element.path : '';

        var filename = element.name + element.extension;
        this.fsService.download(path + filename, path + element.name , element.extension, element.name);//.subscribe((result: any) => {});
      }
    });
  }

  /** RECEIVE ID RENAME
   * Get element id from child after event rename
   * Show rename input on table
   * Close list setting on done
   */
  /*receiveIdRename($event) {
    this.data.forEach(element => {
      if (element.id === $event) {
        var filename = element.name + element.extension;
        var path = !!(element.path) ? element.path : '';
        this.fsService.download(path + filename, path + element.name, element.extension, element.name);
      }
    });
  }*/

  receiveIdRename($event) {
    let renameElement;
    this.data.forEach(element => {
      if (element.id == $event) {
        renameElement = element;
        return;
      }
    });

    const dialogRef = this.dialog.open(RenameFileComponent, {
      width: '30%',
      height: '30%',
      data: renameElement,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.done) {
        this.changeName(renameElement.id, result.name);
      }
    });
  }

  async getCopyFile(val, others) {
    if (Array.isArray(val)) {
      for (var a = 0; a < val.length; a++) {
        let count = 1;
        for (var b in this.dataValue) {
          if ((this.dataValue[b].name.includes(val[a].name) && this.dataValue[b].name.includes('(copy')) && this.dataValue[b].extension == val[a].extension) {
            count = count + 1;
          }
        }

        let source = val[a].path + val[a].name + val[a].extension;
        let name = val[a].name + ' (copy ' + count + ')' + val[a].extension
        let destination = others.destination + name;
        let waitService = await this.fsService.copyFile(source, destination).toPromise();
        if(waitService.status == 'success')
          this.showMessage(this.copySuccess, 'success');
      }
    } else {
      let count = 1
      for (var i in this.dataValue) {
        if ((this.dataValue[i].name.includes(val.name) && this.dataValue[i].name.includes('(copy')) && this.dataValue[i].extension == val.exte) {
          count = count + 1;
        }
      }

      let source = val.path + val.name + val.exte;
      let name = val.name + ' (copy ' + count + ')' + val.exte
      let destination = others.destination + name;
      let waitService = await this.fsService.copyFile(source, destination).toPromise();
      if(waitService.status == 'success')
        this.showMessage(this.copySuccess, 'success');
    }
  }

  /** RECEIVE ID TOGGLE FAVORITE
   * Get element id from child after event add/remove favorite
   * Hide element with boolean
   * Close list settings on done
   * TO DO: Call function delete file or folder
   */
  receiveIdToggleFavorite($event) {
    this.data.forEach(element => {
      if (element.id == $event) element.favorite = !element.favorite;
    });
  }

  /** RECEIVE ID DETAILS
   * Get element id from child after event open details
   * Open side bar with details
   * Close list setting on done
   */
  receiveIdDetails($event){
    this.dataSource.data.forEach(row => { row.isRow = false; });
    this.sidebarService.toggle([], null, 'allfiles');
    this.selection.clear();
    for(var i in this.data){
      if(this.data[i].id == $event){
        this.sidebarService.toggle(this.data[i], $event, 'shares');
        this.data[i].isRow = true;
        break;
      }
    }
  }

  get isLoading() {
    return SharesTableComponent.isLoadingStatic;
  }

  ngOnChanges(changes: SimpleChanges) {
    const activity = changes.dataValue;
    if(!activity || activity.currentValue.length==0){
      this.dataValue = [];
    }else if (activity.currentValue.length>0 && (!activity.previousValue || activity.previousValue.length>=0)) {
      this.dataSource = SharesTableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
      this.dataSource.data = this.dataValue;
      this.getAllContent = this.getContentString();
    }
  }
  
  /********************************************************/
  /*** LIST FUNCTIONS OR OUTPUT FUNCTION FROM LIST (END) **/
  /********************************************************/

  ngOnDestroy(){    
    if(this.sidebarServices) this.sidebarServices.unsubscribe();
  }

}
