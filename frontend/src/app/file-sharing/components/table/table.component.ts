import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Dictionary } from '../../dictionary/dictionary';
import { Utilities, FileSharingData } from '../../utilities';
import { __importDefault } from 'tslib';
import { FileSharingService } from '../../services/file-sharing.service';
import { Router } from '@angular/router';
import { SidebarService, SidebarTableService } from '../../services/sidebar.service';
import { MatDialog } from '@angular/material/dialog';
import { AudioVideoComponent } from '../dialogs/audio-video/audio-video.component';
import { DialogPdfComponent } from '../dialogs/dialog-pdf/dialog-pdf.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { DuplicateFileComponent } from 'src/app/file-sharing/components/dialogs/duplicate-file/duplicate-file.component';
import { DataSharingService } from 'src/app/app-services/data-sharing.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RenameFileComponent } from '../dialogs/rename-file/rename-file.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnChanges, OnDestroy {

  static isLoadingStatic: boolean;
  static getPageStatic: string;
  static utilStatic = new Utilities();
  static fsServiceStatic;
  static spinnerStatic;
  static dialogStatic;
  static routerStatic;
  /* For upload file count - loading image*/
  static uploadCount = 1;
  static dataSourceStatic;

  /* @Input, @Output */
  @Input() dataValue;
  @Input() pageFavorite: boolean;
  @Input() getpage: string;
  @Input() permissions: any;
  @Output() reload: EventEmitter<any> = new EventEmitter();
  @ViewChild(MatSort) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  /* Others data value */
  dict = new Dictionary();
  util = new Utilities();
  data: any;
  name: string = this.dict.getDictionary('name');
  fileweight: string = this.dict.getDictionary('size');
  lastupdate: string = this.dict.getDictionary('last_update');
  getAllContent: string;
  dictLabelShared: string = this.dict.getDictionary('label_shared');
  user: string;
  selectedid: number;
  copySuccess: string = this.dict.getDictionary('copy_done');
  isCrearable = false;
  renameSuccess: string = this.dict.getDictionary('rename_success');
  componentIsLoading: boolean;
  componentUploadCount = 1;
  displayedColumns: string[];
  dataSource: MatTableDataSource<FileSharingData>;
  selection = new SelectionModel<FileSharingData>(true, []);
  sortUpdate: boolean = false;
  unsubscribeLater: Subscription;

  constructor(
    private fsService: FileSharingService,
    private router: Router,
    private SidebarService: SidebarService,
    private SidebarTableService: SidebarTableService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private dataSharingService: DataSharingService,
    private _snackBar: MatSnackBar,
  ) {
    this.user = sessionStorage.getItem('user');

    TableComponent.fsServiceStatic = fsService;
    TableComponent.spinnerStatic = spinner;
    TableComponent.routerStatic = router;
    TableComponent.dialogStatic = dialog;
    TableComponent.getPageStatic = this.getpage;

    this.unsubscribeLater = this.SidebarTableService.change.subscribe(data => {
      if (data.type === 'delete') {
        this.receiveIdDelete(data.id);
      } else if (data.type === 'rename') {
        this.receiveIdRename(data.id);
      } else if (data.type === 'favorite') {
        this.receiveIdToggleFavorite(data.id);
      } else if (data.type === 'row') {
        this.receiveIdToggleRow();
      } else if (data.type === 'copy') {
        if (Array.isArray(data.info)) {
          this.getCopyFile(data.info, data.others);
        } else {
          const stringParam = {
            path: (data.info.homepath) ? data.info.homepath : data.info.path,
            name: (data.info.realname) ? data.info.realname : data.info.name,
            exte: data.info.extension
          };
          this.getCopyFile(stringParam, data.others);
        }
      }

    });
  }

  ngOnInit() {
    if(['recents', 'favorites'].includes(this.getpage)) this.displayedColumns = ['id', 'image', 'name', 'share', 'dateFunc', 'weight', 'senddetails'];
    else this.displayedColumns = ['select', 'id', 'image', 'name', 'share', 'dateFunc', 'weight', 'senddetails'];

    if (this.permissions === undefined || this.permissions) {
      this.isCrearable = true;
    }

    if (this.dataValue.length > 0 && this.dataValue) {
      this.data = this.dataValue;
    } else {
      this.data = [];
    }

    this.dataSource = TableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
    this.dataSource.data = this.data;
    this.getAllContent = this.getContentString();
    this.focusRowFavorites();
  }

  ngAfterViewInit(){ 
    /** Task VDESK-154 */
    this.selectRowIfJustSigned();
  }
  /** Task VDESK-154 */
  selectRowIfJustSigned() {
    var justSignedFileId;
    if (justSignedFileId = sessionStorage.getItem('justSignedFileId')) {
      let index = this.dataValue.findIndex(x => x.id == justSignedFileId);
      this.dataValue[index].isRow = true;
      setTimeout(function() { sessionStorage.removeItem('justSignedFileId'); }, 60000);
    }
  }

  focusRowFavorites() {
    const favoriteElement = this.dataSharingService.getFavoritesCardData();
    const sharedFileId = this.dataSharingService.getSharedFileId();

    if (favoriteElement) {
      if (!favoriteElement.file && !favoriteElement.extension) {
        this.openFolder(favoriteElement.path);
      } else {
        this.data.forEach((row: any) => {
          if (row.id === favoriteElement.id) {
            row.isRow = true;
          }
        });
      }
    } else if (sharedFileId) {

      this.data.forEach(row => {
        if (row.id === sharedFileId) {
          row.isRow = true;
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const activity = changes.dataValue;
    if (activity.currentValue.length > 0) {
      // this.ngOnInit();
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
    const array = [];
    if (this.isAllSelected()) {
      this.dataSource.data.forEach(row => { row.isRow = false; });
      this.SidebarService.toggle(array, null, this.getpage);
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(row => {
        if(!row.isRow) row.isRow = !row.isRow;
        array.push(row);
        this.selection.select(row);
      });
      this.SidebarService.toggle(array, null, this.getpage);
    }
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: FileSharingData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  /* ON SELECT ROW
   * On select row send multiple data to sidebar
   * Id is null on toggle (second value)
   */

  onSelectRow($event, row) {
    this.clearRowAll();
    row.isRow = (this.selection.isSelected(row)) ? false : true;
    this.SidebarService.toggle(row, null, this.getpage);
    return `${$event ? this.selection.toggle(row) : null}`;
  }

  /* CLEAR ROW ALL
   * Clear al row on changes check/no
   */
  clearRowAll() {
    for (const i in this.data) {
      if (this.data[i].isRow) {
        this.data[i].isRow = false;
        break;
      }
    }
  }

  /** SORT EVERYTHING
   * Sort table columns for type (name, size, date)
   * @param type : string
   **/
  sortEverything(type: string) {
    if (this.sortUpdate) {
      if (type == "name") this.dataValue.sort((a, b) => (b.name.toLowerCase() > a.name.toLowerCase()) ? 1 : -1);
      else if (type == "date") this.dataValue.sort((a, b) => (parseInt(b.lastUpdate) > parseInt(a.lastUpdate)) ? 1 : -1);
      else if (type == "size") this.dataValue.sort((a, b) => (parseInt(b.fileWeight) > parseInt(a.fileWeight)) ? 1 : -1);
      this.dataSource = TableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
      this.dataSource.data = this.dataValue;
      this.sortUpdate = !this.sortUpdate;
    } else {
      if (type == "name") this.dataValue.sort((a, b) => (b.name.toLowerCase() < a.name.toLowerCase()) ? 1 : -1);
      else if (type == "date") this.dataValue.sort((a, b) => (parseInt(b.lastUpdate) < parseInt(a.lastUpdate)) ? 1 : -1);
      else if (type == "size") this.dataValue.sort((a, b) => (parseInt(b.fileWeight) < parseInt(a.fileWeight)) ? 1 : -1);
      this.dataSource = TableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
      this.dataSource.data = this.dataValue;
      this.sortUpdate = !this.sortUpdate;
    }
  }

  /* CHANGE NAME
   * Event : on click send data to save new name
   * TO DO: call service on done
   * @param name
   * @param id
   */
  async changeName(id: number, newname: string) {
    for (const i in this.data) {
      if (this.data[i].id === id && this.data[i].name !== newname) {
        const source = ((this.data[i].path === '/') ? '' : this.data[i].path) + this.data[i].name + this.data[i].extension;
        const destination = ((this.data[i].path === '/') ? '' : this.data[i].path) + newname + this.data[i].extension;
        const waitService = await this.fsService.renameFileFolder(source, destination).toPromise();
        if (waitService.status.toLowerCase() === 'success') {
          this._snackBar.open(this.renameSuccess, '', {
            duration: 4000,
            panelClass: 'toast-success'
          });
          this.data[i].name = newname;
          this.data[i].realname = newname;
          this.data[i].isRow = false;
          this.SidebarService.toggle(this.data[i], id, this.getpage);
          break;
        }
      }
    }
  }

  /* OPEN FOLDER
   * Get element name and file on click
   * Call service files to get content
   * @param name
   */
  openFolder(name: string) {
    const url = decodeURIComponent(this.router.url);
    if (url.includes('/filesharing/folder/')) {
      const check = '/filesharing/folder/';
      const index = url.indexOf(check);
      const pathvalue = url.slice(index + check.length);
      const home = '&home=';
      const path = pathvalue.slice((pathvalue.indexOf(home) + home.length));
      // Nuova gestione path
      this.dataSharingService.changePath(name);
      name = name.replace(/\//g, '%252F');
      this.router.navigate(['filesharing', 'folder', name], { queryParams: { name: name, home: path } }).finally( () => {
        this.dataSharingService.changePath(name);
      });
      TableComponent.dataSourceStatic.data = [];
    } else {
      const check = '/filesharing/';
      const index = url.indexOf(check);
      let path;
      if(this.getpage=='recents' || this.getpage=='favorites') path = 'all-files';
      else path = url.slice(index + check.length);
      // Nuova gestione path
      this.dataSharingService.changePath(name);
      name = name.replace(/\//g, '%252F');
      this.router.navigate(['filesharing', 'folder', name], { queryParams: { name: name, home: path } }).finally( () => {
        this.dataSharingService.changePath(name);
      });
      TableComponent.dataSourceStatic.data = [];
    }
  }

  /* CHECK NAME FILE/FOLDER CLICK */
  onNameClick(element: any) {

    if (element.file) {

      if (this.util.allData.video.includes(element.extension) || this.util.allData.audio.includes(element.extension) ||
        this.util.allData.image.includes(element.extension)) {
        this.openDialogAudioVideo(element);
      } else if (this.util.allData.pdf.includes(element.extension)) {
        TableComponent.isLoadingStatic = true;
        TableComponent.spinnerStatic.show();
        const uri = element.path + ((element.realname) ? element.realname : element.name) + element.extension;
        this.fsService.getBody(uri).subscribe((result: any) => {
          const reader = new FileReader();
          reader.readAsDataURL(result.body);
          reader.onloadend = function () {
            return reader.result;
          };

          const interval = setInterval(function () {
            if (reader.result) {
              TableComponent.spinnerStatic.hide();
              TableComponent.isLoadingStatic = false;
              clearInterval(interval);
              this.openDialogPdf(element, reader.result);
            }
          }.bind(this), 1000);

        });
      } else if (this.util.allData.text.includes(element.extension) || this.util.allData.spredsheet.includes(element.extension) ||
        this.util.allData.powerpoint.includes(element.extension) || this.util.allData.richtext.includes(element.extension)) {
          let FilePath = element.path + ((element.realname)? element.realname : element.name) + element.extension;
          this.openOnlyOffice(element,FilePath);
      }

    } else {
      if (this.getpage !== 'protected') {
        let completeName = '';
        let arrayComplete = '';
        if (element.path.length > 0 && element.path !== '/') {
          const testArray = element.path.split('/');
          for (const i in testArray) {
            if (testArray[i].length === 0) {
              testArray.splice(i, 1);
            }
          }
          // if(testArray[testArray.length - 1] == element.name) testArray.splice(testArray.length - 1, 1);
          arrayComplete = testArray.join('/');
        }

        completeName = arrayComplete + ((arrayComplete.length > 0) ? '/' : '') + element.name;
        this.openFolder(completeName);
      }
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

  getContentString() {
    let folders = 0, files = 0, size = 0;
    for (var i in this.data) {
      folders = (!this.data[i].file) ? folders + 1 : folders;
      files = (this.data[i].file) ? files + 1 : files;
      size = (this.data[i].fileWeight > 0) ? (size + parseInt(this.data[i].fileWeight)) : size;
    }
    let string = folders + ' Cartelle e ' + files + ' Files - ' + this.util.getWeight(size) + ' occupati';
    return string;
  }

  openShare($event) {
    this.dataSource.data.forEach(row => { row.isRow = false; });
    this.SidebarService.toggle([], null, 'allfiles');
    this.selection.clear();
    for (const i in this.data) {
      if (this.data[i].id === $event) {
        const data = { info: this.data[i], tabToOpen: 'share' };
        this.SidebarService.toggle(data, $event, this.getpage);
        break;
      }
    }
  }


  /********************************************************/
  /** FUNCTIONS OR OUTPUT FUNCTION FROM SIDEBAR (START) ***/
  /********************************************************/

  receiveIdToggleRow() {
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
        if (this.selectedid) this.selectedid = null;
      }
    });

    TableComponent.spinnerStatic.hide();
    TableComponent.isLoadingStatic = false;
  }

  /** RECEIVE ID RENAME
   * Get element id from sidebar after event rename
   * Show rename input on table
   * Close list setting on done
   */
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

  /** RECEIVE ID TOGGLE FAVORITE
   * Get element id from sidebar after event favorite
   * Hide element with boolean
   * Close list settings on done
   */
  receiveIdToggleFavorite($event) {
    this.data.forEach(element => {
      if (element.id == $event) {
        element.favorite = !element.favorite;
        if (this.pageFavorite) element.hide = !element.hide;
      }
    });
  }


  /** RECEIVE ID DETAILS
   * Get element id from child after event open details
   * Open side bar with details
   * Close list setting on done
   */
  receiveIdDetails($event: any) {
    this.dataSource.data.forEach(row => { row.isRow = false; });
    this.SidebarService.toggle([], null, 'allfiles');
    this.selection.clear();

    if ($event.image != 'storage') {
      this.clearRowAll();

      for (let i in this.data) {
        if (this.data[i].id == $event.id) {
          this.SidebarService.toggle(this.data[i], $event.id, this.getpage);
          this.selectedid = $event.id;
          this.data[i].isRow = true;
          break;
        }
      }
    }
  }

  /**
   * Manage File Upload
   */
  static uploadFile(fileObj) {
    TableComponent.uploadCount = 1;
    TableComponent.isLoadingStatic = true;
    TableComponent.spinnerStatic.show();
    var files = fileObj.files;
    var folder = new URLSearchParams(window.location.search).get('name');
    folder = (!!folder) ? folder + '/' : '';
    if (fileObj.isFolder) {
      var folderObj = fileObj.folderObj;
      TableComponent.dataSourceStatic.data.push(TableComponent.utilStatic.getFolderElement(folderObj, true, false));
      TableComponent.dataSourceStatic.filter = "";
      TableComponent.fsServiceStatic.createFolder(folder + folderObj.name).subscribe((result: any) => {
        for (var file of files) {
          TableComponent.fsServiceStatic.upload(folder + folderObj.name + '/' + file.name, file).subscribe((result: any) => {
            if (TableComponent.uploadCount == files.length) {
              TableComponent.spinnerStatic.hide();
              TableComponent.isLoadingStatic = false;
            }
            TableComponent.uploadCount++;
          });
        }
      });
    } else {
      let arrayCheck = [];
      let data = TableComponent.dataSourceStatic.filteredData;
      for (var file of files) {
        for (var a in data) {
          if (data[a].name + data[a].extension == file.name) {
            arrayCheck.push(data[a]);
          }
        }
      }

      if (arrayCheck.length > 0) {
        const dialogRef = TableComponent.dialogStatic.open(DuplicateFileComponent, {
          width: '40%',
          height: '60%',
          data: { data: arrayCheck, files: files }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (!result || result == undefined) {
            TableComponent.spinnerStatic.hide();
            TableComponent.isLoadingStatic = false;
          } else if (result.length > 0) {
            for (var i in result) {
              if (result[i].new && !result[i].old) {
                for (var file of files) {
                  if (file.name == result[i].name && file.name.indexOf('.') != 0) {
                    TableComponent.uploadCheckedFile(folder, file, files, '');
                  }
                }
              } else if (result[i].new && result[i].old) {
                for (var check of files) {
                  let count = 0;
                  for (var a in data) {
                    if (data[a].name.includes(check.name.slice(0, check.name.lastIndexOf('.'))))
                      count = count + 1;
                  }
                  let extension = check.name.slice(check.name.lastIndexOf('.'));
                  let name = check.name.slice(0, check.name.lastIndexOf('.'));
                  let realname = (count > 1) ? name + ' (' + count + ')' + extension : name + ' (' + 1 + ')' + extension;
                  if (name.indexOf('.') != 0)
                    TableComponent.uploadCheckedFile(folder, check, files, realname);
                }
              } else {
                TableComponent.spinnerStatic.hide();
                TableComponent.isLoadingStatic = false;
              }
            }
          } else {
            TableComponent.spinnerStatic.hide();
            TableComponent.isLoadingStatic = false;
          }
        });
      } else {
        for (var file of files) {
          if (file.name.indexOf('.') != 0)
            TableComponent.uploadCheckedFile(folder, file, files, '');
        }
      }
    }
  }

  static uploadFileEmpty(fileObj) {
    TableComponent.uploadCount = 1;
    TableComponent.isLoadingStatic = true;
    TableComponent.spinnerStatic.show();
    var files = fileObj.files;
    var folder = new URLSearchParams(window.location.search).get('name');
    folder = (!!folder) ? folder + '/' : '';
    if (fileObj.isFolder) {
      var folderObj = fileObj.folderObj;
      TableComponent.dataSourceStatic.data.push(TableComponent.utilStatic.getFolderElement(folderObj, true, false));
      TableComponent.dataSourceStatic.filter = "";
      TableComponent.fsServiceStatic.createFolder(folder + folderObj.name).subscribe((result: any) => {
        for (var file of files) {
          TableComponent.fsServiceStatic.upload(folder + folderObj.name + '/' + file.name, file).subscribe((result: any) => {
            if (TableComponent.uploadCount == files.length) {
              TableComponent.spinnerStatic.hide();
              TableComponent.isLoadingStatic = false;
            }
            TableComponent.uploadCount++;
          });
        }
      });
    } else {
      for (var file of files) {
        if (file.name.indexOf('.') != 0)
          TableComponent.uploadCheckedFile(folder, file, files, '');
      }

      let url = decodeURIComponent(this.routerStatic.url);
      if (url.includes('/filesharing/folder/')) {
        let check = '/filesharing/folder/';
        let index = url.indexOf(check);
        let pathvalue = url.slice(index + check.length);
        let home = '&home=';
        let path = pathvalue.slice((pathvalue.indexOf(home) + home.length));
        folder = folder.split('/').join('');
        this.routerStatic.navigateByUrl('/', { skipLocationChange: true }).then(() => this.routerStatic.navigate(['filesharing', 'folder', folder], { queryParams: { name: folder, home: path } }));
        TableComponent.dataSourceStatic.data = [];
      }
    }
  }

  /** UPLOAD CHECKED FILE **/
  static uploadCheckedFile(folder, file, files, realname) {
    let sendname;
    if (realname.length > 0) sendname = realname;
    else sendname = file.name;

    TableComponent.fsServiceStatic.upload(folder + sendname, file).subscribe((result: any) => {

      TableComponent.fsServiceStatic.getAllFiles(folder + sendname).subscribe((result: any) => {
        for (var item of TableComponent.dataSourceStatic.data) {
          if ((item.name + item.extension) == sendname) {
            item.hide = !item.hide;
            break;
          }
        }
        TableComponent.dataSourceStatic.data.push(TableComponent.utilStatic.getElementByFile(result.body.multistatus.response, folder));

        // STATIC SORT
        TableComponent.dataSourceStatic.data.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
        TableComponent.dataSourceStatic.data.sort((a, b) => (b.file > a.file) ? 1 : -1);
        TableComponent.dataSourceStatic.data.sort((a, b) => (a.favorite < b.favorite) ? 1 : -1);
        // STATIC SORT

        TableComponent.dataSourceStatic.filter = "";
        if (TableComponent.uploadCount == files.length) {
          TableComponent.spinnerStatic.hide();
          TableComponent.isLoadingStatic = false;
        }
        TableComponent.uploadCount++;
      });
    });
  }

  /** COMPONENT UPLOAD FILE
   * Upload file/folder on drag&drop
   * @param fileObj
   **/
  componentUploadFile(fileObj) {
    this.componentUploadCount = 1;
    this.componentIsLoading = true;
    var files = fileObj.files;
    var folder = new URLSearchParams(window.location.search).get('name');
    folder = (!!folder) ? folder + '/' : '';
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
  /** CREATE NEW FOLDER
   * @param name name of new folder created
   * This function add a new temporary folder in the table
   **/
  static createNewFolder(name) {
    var checkLoader = (TableComponent.dataSourceStatic != undefined) ? true : false;
    var checkEmpty = (TableComponent.dataSourceStatic.data.length == 0) ? true : false;

    if (checkLoader) {
      TableComponent.isLoadingStatic = true;
      TableComponent.spinnerStatic.show();
    }

    var folder = new URLSearchParams(window.location.search).get('name');
    folder = (!!folder) ? folder + '/' : '';

    TableComponent.fsServiceStatic.createFolder(folder + name).subscribe((result: any) => {
      TableComponent.fsServiceStatic.getAllFiles(folder + name).subscribe((result: any) => {
        if (name.indexOf('.') > 0 || name.indexOf('.') == -1) {
          TableComponent.dataSourceStatic.data.push(TableComponent.utilStatic.getFolderElement(result.body.multistatus.response, false, false));

          // STATIC SORT
          TableComponent.dataSourceStatic.data.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
          TableComponent.dataSourceStatic.data.sort((a, b) => (b.file > a.file) ? 1 : -1);
          TableComponent.dataSourceStatic.data.sort((a, b) => (a.favorite < b.favorite) ? 1 : -1);
          // STATIC SORT
        }
        if (checkEmpty) {
          let array = folder.split('/');
          if (!(array[array.length - 1].length > 0)) array.pop();
          let name = array.join('/');
          this.routerStatic.navigateByUrl('/', { skipLocationChange: true }).then(
            () => this.routerStatic.navigate(['filesharing', 'folder', folder], { queryParams: { name: name, home: 'all-files' } }));

        }

        if (checkLoader) {
          TableComponent.dataSourceStatic.filter = "";
          TableComponent.spinnerStatic.hide();
          TableComponent.isLoadingStatic = false;
        }
      });
    });
  }

  /** CREATE NEW FILE TXT
   * @param name name of new file created
   * This function add a new temporary file in the table
   **/
  static createNewFileTxt(name, id) {
    var checkLoader = (TableComponent.dataSourceStatic != undefined) ? true : false;
    var checkEmpty = (TableComponent.dataSourceStatic.data.length == 0) ? true : false;

    if (checkLoader) {
      TableComponent.isLoadingStatic = true;
      TableComponent.spinnerStatic.show();
    }

    var folder = new URLSearchParams(window.location.search).get('name');
    folder = (!!folder) ? folder + '/' : '';
    TableComponent.dataSourceStatic.data.push(TableComponent.utilStatic.getFileElementTxt(name, id, folder, false));

    TableComponent.dataSourceStatic.data.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
    TableComponent.dataSourceStatic.data.sort((a, b) => (b.file > a.file) ? 1 : -1);
    TableComponent.dataSourceStatic.data.sort((a, b) => (a.favorite < b.favorite) ? 1 : -1);

    if (checkEmpty) {
      let array = folder.split('/');
      if (!(array[array.length - 1].length > 0)) array.pop();
      let name = array.join('/');
      this.routerStatic.navigateByUrl('/', { skipLocationChange: true }).then(
        () => this.routerStatic.navigate(['filesharing', 'folder', folder], { queryParams: { name: name, home: 'all-files' } }));

    }

    if (checkLoader) {
      TableComponent.dataSourceStatic.filter = "";
      TableComponent.spinnerStatic.hide();
      TableComponent.isLoadingStatic = false;
    }
  }

  /** CREATE NEW FILE OO
   * Create new file with onlyoffice
   * @param name
   */
  static createNewFileOO(name: string, extension: string, result) {
    var checkLoader = (TableComponent.dataSourceStatic != undefined) ? true : false;
    var checkEmpty = (TableComponent.dataSourceStatic.data.length == 0) ? true : false;

    if (checkLoader) {
      TableComponent.isLoadingStatic = true;
      TableComponent.spinnerStatic.show();
    }

    var folder = new URLSearchParams(window.location.search).get('name');
    folder = (!!folder) ? folder + '/' : '';
    TableComponent.dataSourceStatic.data.push(TableComponent.utilStatic.getFileElementOO(name, extension, folder, result));
    // STATIC SORT
    TableComponent.dataSourceStatic.data.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
    TableComponent.dataSourceStatic.data.sort((a, b) => (b.file > a.file) ? 1 : -1);
    TableComponent.dataSourceStatic.data.sort((a, b) => (a.favorite < b.favorite) ? 1 : -1);
    // STATIC SORT
    if (checkEmpty) {
      let array = folder.split('/');
      if (!(array[array.length - 1].length > 0)) array.pop();
      let name = array.join('/');
      this.routerStatic.navigateByUrl('/', { skipLocationChange: true }).then(
        () => this.routerStatic.navigate(['filesharing', 'folder', folder], { queryParams: { name: name, home: 'all-files' } }));

    }
    if (checkLoader) {
      TableComponent.dataSourceStatic.filter = "";
      TableComponent.spinnerStatic.hide();
      TableComponent.isLoadingStatic = false;
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

        let source = val[a].path + val[a].name + val[a].extension;
        let name = val[a].name + ' (copy ' + count + ')' + val[a].extension
        let destination = others.destination + name;
        this.fsService.copyFile(source, destination).subscribe((result: any) => {
          if (result.status == 'success') {
            this._snackBar.open(this.copySuccess, '', {
              duration: 4000,
              panelClass: 'toast-success'
            });
          }
        });
      }
      if (!others.destination || others.destination == '/') this.reload.emit('');
    } else {
      let count = 1
      for (var i in this.data) {
        if ((this.data[i].name.includes(val.name) && this.data[i].name.includes('(copy')) && this.data[i].extension == val.exte) {
          count = count + 1;
        }
      }

      let source = val.path + val.name + val.exte;
      let name = val.name + ' (copy ' + count + ')' + val.exte
      let destination = others.destination + name;
      this.fsService.copyFile(source, destination).subscribe((result: any) => {
        if (result.status == 'success') {
          this._snackBar.open(this.copySuccess, '', {
            duration: 4000,
            panelClass: 'toast-success'
          });
          if (!others.destination || others.destination == '/') this.reload.emit('');
        }
      });
    }
  }

  get isLoading() {
    return TableComponent.isLoadingStatic;
  }
  /********************************************************/
  /*** FUNCTIONS OR OUTPUT FUNCTION FROM SIDEBAR (END)   **/
  /********************************************************/


  /** OPEN DIALOG AUDIO-VIDEO FILE **/
  openDialogAudioVideo(data): void {
    TableComponent.isLoadingStatic = true;
    TableComponent.spinnerStatic.show();

    this.fsService.getUrl(data).subscribe((result: any) => {
      const dialogRef = this.dialog.open(AudioVideoComponent, {
        width: '60%',
        height: '60%',
        data: { data: data, href: result }
      });

      dialogRef.afterClosed().subscribe(result => { });

      TableComponent.spinnerStatic.hide();
      TableComponent.isLoadingStatic = false;
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

  ngOnDestroy() {
    this.dataSharingService.setFavoritesCardData(null);
    this.dataSharingService.setSharedFileId(null);
    if(this.unsubscribeLater) this.unsubscribeLater.unsubscribe();
  }

}
