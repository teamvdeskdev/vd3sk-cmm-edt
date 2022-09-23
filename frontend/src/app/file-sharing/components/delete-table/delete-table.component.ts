import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Dictionary } from '../../dictionary/dictionary';
import { Utilities, FileDeletedData } from '../../utilities';
import { __importDefault } from 'tslib';
import { FileSharingService } from '../../services/file-sharing.service';
import { Router, RouterModule } from '@angular/router';
import { SidebarService, SidebarTableService } from '../../services/sidebar.service';
import { DialogDeleteFileComponent } from '../dialogs/delete-file/delete-file.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataSharingService } from 'src/app/app-services/data-sharing.service';


@Component({
  selector: 'app-delete-table',
  templateUrl: './delete-table.component.html',
  styleUrls: ['./delete-table.component.scss']
})
export class DeleteTableComponent implements OnInit/*, OnChanges*/ {

  /* @Input, @Output */
  @Input() dataValue;
  @Input() pageFavorite: boolean;
  @Output() nodata: EventEmitter<any> = new EventEmitter();
  @ViewChild(MatSort) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  /* Others data value */
  dict = new Dictionary();
  util = new Utilities();
  data: any;
  done: boolean = true;
  name: string = this.dict.getDictionary('name');
  lastupdate: string = this.dict.getDictionary('deleted');
  restore: string = this.dict.getDictionary('restore');
  deletedialogString: string = this.dict.getDictionary('delete_dialog_file_definitively');
  getAllContent: string;
  deletedialogResponse: string;
  restoreSuccess: string = this.dict.getDictionary('restore_success');
  deleteIcon: string = this.dict.getDictionary('deleteAll');
  deleteSuccess: string = this.dict.getDictionary('deleted_files_success');
  sortUpdate: boolean = false;

  static isLoadingStatic: boolean;
  static utilStatic = new Utilities();
  static fsServiceStatic;
  /* For upload file count - loading image*/
  static uploadCount = 1;

  displayedColumns: string[] = ['select', 'id', 'image', 'name', 'restore', 'remove', 'deletedTime'];
  dataSource: MatTableDataSource<FileDeletedData>;
  static dataSourceStatic;
  selection = new SelectionModel<FileDeletedData>(true, []);

  constructor(
    private fsService: FileSharingService,
    private router: Router,
    private SidebarService : SidebarService,
    private SidebarTableService: SidebarTableService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private dataSharingService: DataSharingService
  ) {
    /*
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    */
    DeleteTableComponent.fsServiceStatic = fsService;
  }

  ngOnInit() {
    
    this.SidebarTableService.change.subscribe(data => {
      if(data.type=="delete" || data.type=="restore"){
        this.receiveIdDelete(data.id);
      }

    });

    if (this.dataValue.length > 0 && this.dataValue) {
      this.data = this.dataValue;
    } else {
      this.data = [];
    }

    this.dataSource = DeleteTableComponent.dataSourceStatic = new MatTableDataSource<FileDeletedData>();
    this.dataSource.data = this.data;
    this.getAllContent = this.getContentString();
  }

  /** SHOW LOADER **/
  showLoader(){
    this.done = false;
    this.spinner.show();
  }

  /** CLOSE LOADER **/
  closeLoader(){
    this.spinner.hide();
    this.done = true;
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
      this.SidebarService.toggle(array, null, 'delete');
      this.selection.clear();
    }else{
      this.dataSource.data.forEach(row => {
        if(!row.isRow){
          row.isRow = true;
          array.push(row);
          this.selection.select(row);
        }        
      });
      this.SidebarService.toggle(array, null, 'delete');
    }   
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: FileDeletedData): string {
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
    row.isRow = (this.selection.isSelected(row))? false : true;
    this.SidebarService.toggle(row, null, 'delete');
    return `${$event ? this.selection.toggle(row) : null}`;
  }

  getContentString(){
    let folders = 0, files = 0, size = 0;
    for (var i in this.data) {
      folders = (!this.data[i].file) ? folders + 1 : folders;
      files = (this.data[i].file) ? files + 1 : files;
      size = (this.data[i].fileWeight > 0) ? (size + parseInt(this.data[i].fileWeight)) : size;
    }
    let string = folders + ' Cartelle e ' + files + ' Files - ' + this.util.getWeight(size) + ' occupati';
    return string;
  }

  /** SORT EVERYTHING
   * Sort table columns for type (name, size, date)
   * @param type : string
   **/
   sortEverything(type: string){
    if(this.sortUpdate){
      if(type=="name") this.dataValue.sort((a, b) => (b.name.toLowerCase() > a.name.toLowerCase()) ? 1 : -1);
      else if(type=="date") this.dataValue.sort((a, b) => (parseInt(b.deletedTimestamp) > parseInt(a.deletedTimestamp)) ? 1 : -1);
      this.dataSource = DeleteTableComponent.dataSourceStatic = new MatTableDataSource<FileDeletedData>();
      this.dataSource.data = this.dataValue;
      this.sortUpdate = !this.sortUpdate;
    }else{
      if(type=="name") this.dataValue.sort((a, b) => (b.name.toLowerCase() < a.name.toLowerCase()) ? 1 : -1);
      else if(type=="date") this.dataValue.sort((a, b) => (parseInt(b.deletedTimestamp) < parseInt(a.deletedTimestamp)) ? 1 : -1);
      this.dataSource = DeleteTableComponent.dataSourceStatic = new MatTableDataSource<FileDeletedData>();
      this.dataSource.data = this.dataValue;
      this.sortUpdate = !this.sortUpdate;
    }    
  }

    /** OPEN FOLDER
   * Get element name and file on click
   * Call service files to get content
   * @param name
   * @param file
   */
  openFolder(element: any) {
    if(!element.file){
      let url = decodeURIComponent(this.router.url);
      if(url.includes('/filesharing/folder/')){
          let indexName = url.indexOf('?name=') + '?name='.length;
          let indexHome = url.indexOf('&home=');
          let name = url.slice(indexName, indexHome)
          let firstName = name.split('/')[0];
          let array = element.originalPath.split('/'); 
          array.shift();
          let path = array.join('/');
          let completename = firstName + '/' + path;
          //this.dataSharingService.changePath(element.originalPath);
          element.originalPath = element.originalPath.replace(/\//g, '%252F');
          this.router.navigate(['filesharing', 'folder', element.originalPath], { queryParams: { name: completename, home: 'deleted' } }).finally( () => {
            this.dataSharingService.changePath(element.originalPath);
          });
      }else{
          let completename = element.name + ('.d' + element.deletedTimestamp);
          //this.dataSharingService.changePath(element.name);
          element.name = element.name.replace(/\//g, '%252F');
          this.router.navigate(['filesharing', 'folder', element.name], { queryParams: { name: completename, home: 'deleted' } }).finally( () => {
            this.dataSharingService.changePath(element.name);
          });
      }
    }
  }

  /** DELETE SINGLE ROW
   *  Delete on click table single row
   **/
  deleteSingleRow($event){
    this.showLoader();
    this.data.forEach( async element => {
      if(element.id == $event){
        let name = element.realname + element.extension;
        let waitService = await this.fsService.getDeletedDefinitelyFiles(name, element.tag).toPromise();
        if(waitService.status.toLowerCase() == 'success'){
          element.hide = !element.hide;
          this._snackBar.open(this.deleteSuccess, '', {
            duration: 4000,
            panelClass: 'toast-success'
          });
          this.closeLoader();
        }
      }
    });
  }

  /** RESTORE SINGLE ROW
   *  Restore on click table single row
   **/
  async restoreSingleRow($event: any){
    this.showLoader();
    let isFolder = this.router.url.includes('folder');
    let completename = $event.realname + $event.extension;
    let extension = '.d' + $event.deletedTimestamp;
    let path = (isFolder)? ($event.originalPath.replace('/'+$event.name+$event.extension,'') + extension) + '/' + completename : (completename + extension);
    let name = (isFolder)? (completename + extension) : completename;
    let waitService = await this.fsService.restoreFile(path, name).toPromise();
    if(waitService.status.toLowerCase() == 'success'){
      this._snackBar.open(this.restoreSuccess, '', {
        duration: 4000,
        panelClass: 'toast-success'
      });
      $event.hide = !$event.hide;
      let objCheckAll = this.data.filter(e => !e.hide);
      if(objCheckAll.length==0)
        this.nodata.emit();
    }
    this.closeLoader();
  }


  /********************************************************/
  /** FUNCTIONS OR OUTPUT FUNCTION FROM SIDEBAR (START) ***/
  /********************************************************/

  /** RECEIVE ID DELETE
   * Get element id from sidebar after event delete
   * Hide element with boolean
   * Close list settings on done
   */
  receiveIdDelete($event) {
    this.showLoader();
    this.data.forEach(element => {
      if (element.id == $event) {
        element.hide = !element.hide;
        this.closeLoader();
        let objCheckAll = this.data.filter(e => !e.hide);
        if(objCheckAll.length==0)
          this.nodata.emit();
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
      if(this.data[i].id == $event && !('isRow' in this.data[i])){
        this.SidebarService.toggle(this.data[i], $event, 'delete');
        break;
      }
    }
  }

  get isLoading() {
    return DeleteTableComponent.isLoadingStatic;
  }

  /********************************************************/
 /*** FUNCTIONS OR OUTPUT FUNCTION FROM SIDEBAR (END)   **/
/********************************************************/

  //----------------------------------------//
 //--------------- DIALOGS ----------------//
//----------------------------------------//

  /** OPEN DIALOG ON DELETE FILE/FOLDER **/
  openDialogDelete($event): void {
    const dialogRef = this.dialog.open(DialogDeleteFileComponent, {
      width: '20%',
      height: '18%',
      data: {string: this.deletedialogString, result: this.deletedialogResponse}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.deletedialogResponse = result;
      if(this.deletedialogResponse){
        this.deleteSingleRow($event);
      }
    });
  }

  //\\----------------------------------------//\\
}
