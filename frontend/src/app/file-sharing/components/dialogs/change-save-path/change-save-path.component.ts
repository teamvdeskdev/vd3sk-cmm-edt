import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Dictionary } from '../../../dictionary/dictionary';
import { FileSharingService } from '../../../services/file-sharing.service';
import { Utilities } from '../../../utilities';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogTableComponent } from '../../dialog-table/dialog-table.component';
import { TableComponent } from '../../table/table.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-change-save-path',
  templateUrl: './change-save-path.component.html',
  styleUrls: ['./change-save-path.component.scss']
})
export class ChangeSavePathComponent implements OnInit {

  dict = new Dictionary();
  @ViewChild('valuenamefolder') searchInput: ElementRef;
  class: string;
  noData: boolean;
  util = new Utilities();
  dataValue = [];
  movepath = '';
  source: string;
  getdata: any;
  name: string;
  inputFolder: boolean;
  isLoading: boolean;
  nofolder: string = this.dict.getDictionary('no_folder');
  folderName: string = this.dict.getDictionary('folder_name');
  createFolder: string = this.dict.getDictionary('create_folder');
  destinationString: string = this.dict.getDictionary('choose_destination');
  selectButton: string = this.dict.getDictionary('select-button');

  constructor(
    private fsService: FileSharingService,
    public dialogRef: MatDialogRef<ChangeSavePathComponent>,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      if (Array.isArray(data.data)) {
        this.getdata = data.data;
      } else {
        this.source = data.data.path + data.data.name + data.data.extension;
        this.name = data.data.name;
        this.getdata = data.data;
      }
    }
  }

  ngOnInit() {
    this.class = 'dialog';
    this.inputFolder = false;
    this.getAllFolders();
  }

  getAllFolders() {
    this.isLoading = true;
    this.spinner.show();
    this.fsService.getAllFiles('').subscribe((result: any) => {
      const response = result.body.multistatus.response;

      if (response.length > 0 && !response.href) {
        this.noData = false;

        if (!Array.isArray(this.getdata)) {
          this.dataValue = this.util.getResponseAllFolder(response, false, this.name);
        } else {
          this.dataValue = this.util.getResponseAllFolder(response, false, this.getdata);
        }

        this.dataValue.sort((a, b) => (a.name < b.name) ? 1 : -1);
        this.dataValue.sort((a, b) => (b.file < a.file) ? 1 : -1);
        this.spinner.hide();
        this.movepath = '';
      } else {
        this.noData = true;
      }

      this.spinner.hide();
      this.isLoading = false;
    });
  }

  navigateFolder($event) {
    let path: any;

    if (this.inputFolder) {
      this.toggleInput();
    }

    if (!$event) {
      this.getAllFolders();
    } else {
      this.isLoading = true;
      this.spinner.show();

      if ($event === Object($event)) {
        this.movepath = $event.result;
      } else {
        this.movepath = this.movepath + '/' + $event;
      }
      path = this.movepath;

      this.fsService.getOpenFolder(path).subscribe((result: any) => {
        const response = result.body.multistatus.response;
        if (response.length > 0 && !response.href) {
          this.noData = false;

          if (!Array.isArray(this.getdata)) {
            this.dataValue = this.util.getResponseAllFolder(response, false, this.name);
          } else {
            this.dataValue = this.util.getResponseAllFolder(response, false, this.getdata);
          }

          if (this.dataValue.length > 0) {
            this.dataValue.sort((a, b) => (a.name < b.name) ? 1 : -1);
            this.dataValue.sort((a, b) => (b.file < a.file) ? 1 : -1);
          } else {
            this.noData = true;
          }
        } else {
          this.noData = true;
        }
        this.spinner.hide();
        this.isLoading = false;
      });
    }
  }

  toggleInput() {
    this.inputFolder = !this.inputFolder;
  }

  createNewFolder(name: string) {
    if (name.length > 0) {
      this.isLoading = true;
      this.spinner.show();

      const folder = (!!this.movepath) ? this.movepath + '/' : '';
      DialogTableComponent.fsServiceStatic.createFolder(folder + name).subscribe((result: any) => { });
      this.fsService.getOpenFolder(this.movepath).subscribe((result: any) => {
        if (result &&
            result.body &&
            result.body.multistatus &&
            result.body.multistatus.response) {
          const response = result.body.multistatus.response;
          this.dataValue = this.util.getResponseAllFolder(response, false, this.getdata);
          this.noData = false;
          this.spinner.hide();
          this.isLoading = false;
        }
      });
      this.toggleInput();
    }
  }

  onConfirmClick(): void {
    const data: ChangeSavePath = {
      destination: this.movepath + '/',
    };
    this.dialogRef.close(data);
  }

  closeDialog(): void {
    const data: ChangeSavePath = {
      destination: ''
    };
    this.dialogRef.close(data);
  }
}

export class ChangeSavePath {
  public destination: string;
}
