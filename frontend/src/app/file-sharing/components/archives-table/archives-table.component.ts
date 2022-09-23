import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Dictionary } from '../../dictionary/dictionary';
import { Utilities, FileSharingData } from '../../utilities';
import { __importDefault } from 'tslib';
import { FileSharingService } from '../../services/file-sharing.service';
import { Router, RouterModule } from '@angular/router';
import { SidebarService, SidebarTableService } from '../../services/sidebar.service';
import { DataSharingService } from 'src/app/app-services/data-sharing.service';

@Component({
  selector: 'app-archives-table',
  templateUrl: './archives-table.component.html',
  styleUrls: ['./archives-table.component.scss']
})
export class ArchivesTableComponent implements OnInit, OnChanges {

  /* @Input, @Output */
  @Input() dataValue;
  @Input() pageFavorite: boolean;
  @Input() isfolder: boolean;
  @ViewChild(MatSort) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  /* Others data value */
  dict = new Dictionary();
  util = new Utilities();
  data: any;
  name: string;
  filetype: string;
  filescope: string;
  fileweight: string;
  lastupdate: string;
  getAllContent: string;
  user: string;

  static isLoadingStatic: boolean;
  componentIsLoading: boolean;
  componentUploadCount: any;
  static utilStatic = new Utilities();
  static fsServiceStatic;
  /* For upload file count - loading image*/
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
    private dataSharingService: DataSharingService
  ) {

    this.name = this.dict.getDictionary('name');
    this.filetype = this.dict.getDictionary('storage_type');
    this.filescope = this.dict.getDictionary('scope');
    this.fileweight = this.dict.getDictionary('size');
    this.lastupdate = this.dict.getDictionary('last_update');
    this.user = sessionStorage.getItem('user');

    /*
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    */

    ArchivesTableComponent.fsServiceStatic = fsService;

    this.SidebarTableService.change.subscribe(data => {
      if(data.type=='delete'){
        this.receiveIdDelete(data.id);
      }else if(data.type=='rename'){
        this.receiveIdRename(data.id);
      }else if(data.type=='favorite'){
        this.receiveIdToggleFavorite(data.id);
      }else if(data.type=='row'){
        this.receiveIdToggleRow();
      }else if(data.type=='copy'){
        if(Array.isArray(data.info)) this.getCopyFile(data.info);
        else{
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

      if('backend' in this.dataValue[0]) this.displayedColumns = ['id', 'image', 'name', 'type', 'scope', 'dateFunc', 'weight'];
      else this.displayedColumns = ['id', 'image', 'name', 'type', 'scope', 'dateFunc', 'weight', 'senddetails'];

    } else {
      this.data = [];
    }

    this.dataSource = ArchivesTableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
    this.dataSource.data = this.data;
    this.getAllContent = this.getContentString();

  }

  ngOnChanges(changes: SimpleChanges) {
    this.ngOnInit();
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
      this.SidebarService.toggle(array, null, 'archives');
      this.selection.clear();
    }else{
      this.dataSource.data.forEach(row => {
        if(!row.isRow) row.isRow = !row.isRow;
        array.push(row);
        this.selection.select(row);
      });
      this.SidebarService.toggle(array, null, 'archives');
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
    row.isRow = (this.selection.isSelected(row))? false : true;
    this.SidebarService.toggle(row, null, 'archives');
    return `${$event ? this.selection.toggle(row) : null}`;
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
          this.SidebarService.toggle(this.data[i], id, 'archives');
        });
        break;
      }
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
          let check = '/filesharing/folder/';
          let index = url.indexOf(check);
          let pathvalue = url.slice(index + check.length);
          let home = '&home=';
          let path = pathvalue.slice((pathvalue.indexOf(home) + home.length));
          let name = element.path + element.name;
          this.dataSharingService.changePath(name);
          name = name.replace(/\//g, '%252F');
          this.router.navigate(['filesharing', 'folder', name], { queryParams: { name: name, home: path } }).finally( () => {
            this.dataSharingService.changePath(name);
          });
      }else{
          let check = '/filesharing/';
          let index = url.indexOf(check);
          let path = url.slice(index + check.length);
          this.dataSharingService.changePath(element.name);
          element.name = element.name.replace(/\//g, '%252F');
          this.router.navigate(['filesharing', 'folder', element.name], { queryParams: { name: element.name, home: path } }).finally( () => {
            this.dataSharingService.changePath(element.name);
          });
      }
    }
  }

  getContentString(){
    let folders=0, files=0;
    for(var i in this.data){
      folders = (!this.data[i].file)? folders+1 : folders;
      files = (this.data[i].file)? files+1 : files;
    }
    let string = folders + ' Cartelle e '+files+' Files';
    return string;
  }

  openShare($event) {
    for (const i in this.data) {
      if (this.data[i].id === $event) {
        const data = {info: this.data[i], tabToOpen: 'share'};
        this.SidebarService.toggle(data, $event, 'archives');
        break;
      }
    }
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
    if (this.isAllSelected()) {
      this.dataSource.data.forEach(row => { row.isRow = false; });
      this.SidebarService.toggle([], null, 'allfiles');
      this.selection.clear();
    }

    for(let i in this.data){
      if(this.data[i].id == $event){
        this.SidebarService.toggle(this.data[i], $event, 'archives');
        break;
      }
    }
  }

  /**
   * Manage File Upload
   */
  static uploadFile(fileObj) {
    ArchivesTableComponent.uploadCount = 1;
    ArchivesTableComponent.isLoadingStatic = true;
    var files = fileObj.files;
    var folder = new URLSearchParams(window.location.search).get('name');
    folder = ( !! folder) ? folder + '/' : '';
    if (fileObj.isFolder) {
      var folderObj = fileObj.folderObj;
      ArchivesTableComponent.dataSourceStatic.data.push(ArchivesTableComponent.utilStatic.getFolderElement(folderObj, true, false));
      ArchivesTableComponent.dataSourceStatic.filter = "";
      ArchivesTableComponent.fsServiceStatic.createFolder(folder + folderObj.name).subscribe((result: any) => {
        for (var file of files) {
          ArchivesTableComponent.fsServiceStatic.upload(folder + folderObj.name + '/' + file.name, file).subscribe((result: any) => {
            if (ArchivesTableComponent.uploadCount == files.length) ArchivesTableComponent.isLoadingStatic = false;
            ArchivesTableComponent.uploadCount++;
          });
        }
      });
    } else {
      for (var file of files) {
        ArchivesTableComponent.fsServiceStatic.upload(folder + file.name, file).subscribe((result: any) => {
          ArchivesTableComponent.dataSourceStatic.data.push(ArchivesTableComponent.utilStatic.getElementByFile(files[ArchivesTableComponent.uploadCount - 1], folder));
          ArchivesTableComponent.dataSourceStatic.filter = "";
          if (ArchivesTableComponent.uploadCount == files.length) ArchivesTableComponent.isLoadingStatic = false;
          ArchivesTableComponent.uploadCount++;
        });
      }
    }
  }
  /**
   * Manage File Upload
   */
  componentUploadFile(fileObj) {
    this.componentUploadCount = 1;
    this.componentIsLoading = true;
    var files = fileObj.files;
    var folder = new URLSearchParams(window.location.search).get('name');
    folder = ( !! folder) ? folder + '/' : '';
    if (fileObj.isFolder) {
      var folderObj = fileObj.folderObj;
      this.dataSource.data.push(this.util.getFolderElement(folderObj, true, false));
      this.dataSource.filter = "";
      this.fsService.createFolder(folder + folderObj.name).subscribe((result: any) => {
        for (var file of files) {
          this.fsService.upload(folder + folderObj.name + '/' + file.name, file).subscribe((result: any) => {
            if (this.componentUploadCount == files.length) this.componentIsLoading = false;
            this.componentUploadCount++;
          });
        }
      });
    } else {
      for (var file of files) {
        this.fsService.upload(folder + file.name, file).subscribe((result: any) => {
          this.dataSource.data.push(this.util.getElementByFile(files[this.componentUploadCount - 1], folder));
          this.dataSource.filter = "";
          if (this.componentUploadCount == files.length) this.componentIsLoading = false;
          this.componentUploadCount++;
        });
      }
    }
  }
  /** **/
  static createNewFolder(name){
      var folder = new URLSearchParams(window.location.search).get('name');
      folder = ( !! folder) ? folder + '/' : '';
      ArchivesTableComponent.dataSourceStatic.data.push(ArchivesTableComponent.utilStatic.getFolderElement(name, false, false));
      ArchivesTableComponent.dataSourceStatic.filter = "";
      ArchivesTableComponent.fsServiceStatic.createFolder(folder + name).subscribe((result: any) => {});
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

  get isLoading() {
    return ArchivesTableComponent.isLoadingStatic;
  }
  /********************************************************/
  /*** FUNCTIONS OR OUTPUT FUNCTION FROM SIDEBAR (END)   **/
  /********************************************************/

}
