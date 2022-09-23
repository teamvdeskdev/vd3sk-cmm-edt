import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Dictionary } from '../../../dictionary/dictionary';
import { TableComponent } from 'src/app/file-sharing/components/table/table.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FileSharingService } from 'src/app/file-sharing/services/file-sharing.service';
import { GlobalVariable } from 'src/app/globalviarables';
import { CreateService } from 'src/app/file-sharing/services/sidebar.service';

@Component({
  selector: 'app-createfile-dialog',
  templateUrl: './createfile-dialog.component.html',
  styleUrls: ['./createfile-dialog.component.scss']
})
export class CreatefileDialogComponent implements OnInit {
  dict = new Dictionary();
  confirmCreate: boolean = false;
  firstBody: boolean = true;
  secondBody: boolean = false;
  arrayElement: any = [];
  elementChoosen: any;
  nameNewElement: string = '';
  data;
  resultText;

  stringCancel: string = this.dict.getDictionary('cancel');
  stringSave: string = this.dict.getDictionary('next');
  stringFolder: string = this.dict.getDictionary('folder');
  stringSubFolder: string = this.dict.getDictionary('createdialog_folder');
  stringDoc: string = this.dict.getDictionary('new_text_doc');
  stringSubDoc: string = this.dict.getDictionary('createdialog_doc');
  stringText: string = this.dict.getDictionary('new_doc');
  stringSubText: string = this.dict.getDictionary('createdialog_note');
  stringExel: string = this.dict.getDictionary('new_exel_doc');
  stringSubExel: string = this.dict.getDictionary('createdialog_exel');
  stringPres: string = this.dict.getDictionary('new_power_doc');
  stringSubPres: string = this.dict.getDictionary('createdialog_pres');
  stringLoad: string = this.dict.getDictionary('upload_file');
  stringTitle: string = this.dict.getDictionary('creates');
  stringSubtitle: string = this.dict.getDictionary('createdialog_subtitle');
  stringSecondTitle: string;
  stringSecondSubtitle: string;
  stringSecondSave: string = this.dict.getDictionary('save');
  folder_exist: string = this.dict.getDictionary('folder_exist');
  file_exist: string = this.dict.getDictionary('file_exist');
  no_name: string = this.dict.getDictionary('no_name');
  filename_doterror: string = this.dict.getDictionary('filename_doterror');
  dictInsertName: string = this.dict.getDictionary('insert_name');
  uploadFileValue: boolean;

  constructor(
    public dialogRef: MatDialogRef<CreatefileDialogComponent>,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private fsService: FileSharingService,
    private dialog: MatDialog,
    private _global: GlobalVariable,
    private _create: CreateService
  ) { }

  ngOnInit() {
    this.arrayElement = [
      { name: this.stringFolder, desc: this.stringSubFolder, icon: 'folder'},
      { name: this.stringDoc, desc: this.stringSubDoc, icon: 'format_align_left'},
      { name: this.stringExel, desc: this.stringSubExel, icon: 'border_all'},
      { name: this.stringPres, desc: this.stringSubPres, icon: 'desktop_windows'},
      { name: this.stringText, desc: this.stringSubText, icon: 'short_text'},
    ];

    this.data = this._global.dataAllFiles;
  }

  /** UNLOCK CREATE
   * On buttons click unlock send button
   * @param $event (Event)
   * @param element (any) element choosen
  **/
  unlockCreate($event, element){
    $event.stopPropagation();
    if(!this.confirmCreate)
      this.confirmCreate = !this.confirmCreate;

    this.elementChoosen = element;
  }

  /** LOCK CREATE
   * On body click block send button
   * @param $event (Event)
  **/
  lockCreate(){
    if(this.confirmCreate)
      this.confirmCreate = !this.confirmCreate;
  }

  /** GOTO SECOND
   * Open second body
   * @param $event (Event)
  **/
  gotoSecond($event){
    $event.stopPropagation();
    this.firstBody = !this.firstBody;
    this.secondBody = !this.secondBody;
    this.stringSecondTitle = this.elementChoosen.name;
    this.stringSecondSubtitle = this.elementChoosen.desc;
  }

  /** GOTO FIRST
   * Open first body
   * @param $event (Event)
  **/
  gotoFirst($event){
    $event.stopPropagation();
    this.firstBody = !this.firstBody;
    this.secondBody = !this.secondBody;
    this.confirmCreate = !this.confirmCreate;
    this.stringSecondTitle = '';
    this.stringSecondSubtitle = '';
  }

  uploadFile(event) {
    event.stopPropagation();
    let dataevent = { files: event.target.files, isFolder: false, folderObj: '' };
    let data = {
      name: this.nameNewElement,
      type: 'upload',
      data: dataevent
    }
    this._create.toggle(data);
    this.uploadFileValue = true;
    this.dialogRef.close(this.uploadFileValue);
  }

  /** CREATE NEW FOLDER
   * Send data to table
   * Return if name empty or name already exist
   * @param name name new folder   
   **/
  createNewFolder(){
    this.nameNewElement = this.nameNewElement.trim();

    //check folder alredy existing
    let exist = false;
    for(var i in this.data){
      if(this.data[i].name == this.nameNewElement && !this.data[i].file){
        exist = !exist;
        break;
      }
    }

    if(exist){
      this.openErrorDialog(this.folder_exist);
      return;
    }
    let data = {
      name: this.nameNewElement,
      type: 'folder',
      data: ''
    }
    this._create.toggle(data);
    this.dialogRef.close();   
  }

  /** CREATE NEW DOCUMENT
   * Create new docx with only office, then open it in blank page and close sidebar list
   * Check if empty and if name file alredy exist
   * @param value (string) file name 
   */
  async createNewDocument(){
    this.nameNewElement = this.nameNewElement.trim();
    let name = this.checkExistence(this.nameNewElement, '.docx');
    let data = {
      name: name + '.docx',
      type: 'doc',
      data: ''
    }
    this._create.toggle(data);
    this.dialogRef.close();
  }

  /** CREATE NEW EXEL
   * Create new xlsx with only office, then open it in blank page and close sidebar list
   * @param value (string) file name 
   */
  async createNewExel(){
    this.nameNewElement = this.nameNewElement.trim();
    let name = this.checkExistence(this.nameNewElement, '.xlsx');
    let data = {
      name: name + '.xlsx',
      type: 'exel',
      data: ''
    }
    this._create.toggle(data);
    this.dialogRef.close();
  }

  /** CREATE NEW POWER
   * Create new pptx with only office, then open it in blank page and close sidebar list
   * @param value (string) file name 
   */
  async createNewPower(){
    this.nameNewElement = this.nameNewElement.trim();
    let name = this.checkExistence(this.nameNewElement, '.pptx');
    let data = {
      name: name + '.pptx',
      type: 'power',
      data: ''
    }
    this._create.toggle(data);
    this.dialogRef.close();
  }

  /** CREATE NEW FILE
   * @param name name new file
   * Send data to table
   **/
  async createNewFile(){
    this.nameNewElement = this.nameNewElement.trim();

    let exist = false;
    for(var i in this.data){
      if(this.data[i].name == this.nameNewElement && this.data[i].extension == '.txt'){
        exist = !exist;
        break;
      }
    }

    if(exist){
      this.openErrorDialog(this.file_exist);
      return;
    }

    let data = {
      name: this.nameNewElement + '.txt',
      type: 'note',
      data: ''
    }
    this._create.toggle(data);
    this.dialogRef.close();
  }

  /** CHECK EMPTY
   * Check empty name
   * @param name (string) name new file/folder
   **/
  checkEmpty(name: string){
    if(!name || name.length==0){
      this.openErrorDialog(this.no_name);
      return true;
    }else{
      return false;
    }
  }

  /** CHECK DOT NAME
   * Check if name has dot on first index
   * @param name (string) name of a new file/folder
   **/
  checkDotName(name: string){
    if(name.indexOf('.')==0){
      this.openErrorDialog(this.filename_doterror);
      return true;
    }else{
      return false;
    }
  }

  /** CHECK EXISTENCE
   * Check if file OnlyOffice exist and return new name
   * @param value (string) file name
   * @param extension (string) file extension
   **/
  checkExistence(value: string, extension: string){
    let arrayCheck = [];
    let name;

    for(var a in this.data){
      if(this.data[a].extension == extension){
        if(this.data[a].name == value || this.data[a].name.slice(0, this.data[a].name.lastIndexOf(' ')) == value) arrayCheck.push(this.data[a]);
      }
    }
    
    if(arrayCheck.length == 0) name = value;
    else if(arrayCheck.length >= 1) name = value + ' (' + arrayCheck.length + ')';

    return name;
  }

  checkTypeNew($event){
    $event.stopPropagation();

    let isEmpty = this.checkEmpty(this.nameNewElement);
    if(isEmpty) return;

    let hasDot = this.checkDotName(this.nameNewElement);
    if(hasDot) return;

    if(this.elementChoosen.name == this.stringFolder) this.createNewFolder();
    else if(this.elementChoosen.name == this.stringDoc) this.createNewDocument();
    else if(this.elementChoosen.name == this.stringExel) this.createNewExel();
    else if(this.elementChoosen.name == this.stringPres) this.createNewPower();
    else if(this.elementChoosen.name == this.stringText) this.createNewFile();
  }

  openErrorDialog(message: string){
    this._snackBar.open(message, '', {
      duration: 4000,
      panelClass: 'toast-error'
    });
  }  

  onConfirmClick($event): void {
    $event.stopPropagation();
    //this.dialogRef.close(sendData);
  }

  onNoClick($event): void {
    $event.stopPropagation();
    this.uploadFileValue = true;
    this.dialogRef.close(this.uploadFileValue);
  }

}
