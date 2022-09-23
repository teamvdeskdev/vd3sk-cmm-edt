import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Utilities } from 'src/app/file-sharing/utilities';
import { TextEditorComponent } from 'src/app/file-sharing/components/dialogs/text-editor/text-editor.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FileSharingService } from 'src/app/file-sharing/services/file-sharing.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UploadLink } from 'src/app/app-pages/external-sharedbylink/components/services/link.service';
import { LanguageService } from 'src/app/app-services/language.service';

@Component({
  selector: 'app-upload-list',
  templateUrl: './upload-list.component.html',
  styleUrls: ['./upload-list.component.scss']
})
export class UploadListComponent implements OnInit {
  @Input() authorization;
  @Input() data;
  util = new Utilities();
  checkNameFolder: boolean = false;
  checkNameFile: boolean = false;
  checkNameDocument: boolean = false;
  checkNameExel: boolean = false;
  checkNamePower: boolean = false;
  resultText: string;

  @Output() isClosingOut = new EventEmitter();
  @Output() newcreateOffice = new EventEmitter();

  constructor(
    private fsService: FileSharingService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private _uploadLink: UploadLink,
    public langService: LanguageService
  ) { }

  ngOnInit() {
  }

  /** UPLOAD FILE
   * @param event: any
   * Get data and send them to table
   * Close list
   **/
  uploadFile(event) {
    let data = {
      type: 'upload',
      data: { files: event.target.files, isFolder: false, folderObj: '' }
    };
    this._uploadLink.toggle(data);
    this.isClosingOut.emit(true);
  }

  openTextEditor(fileid, name, resultcreate): void {
      const dialogRef = this.dialog.open(TextEditorComponent, {
        width: '70%',
        height: '70%',
        data: {}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        this.resultText = result.filetext.replace( /(<([^>]+)>)/ig, '');
        let steps = this.buildSteps();
        let data = {
          documentId: resultcreate.body.document.id,
          filePath: '/remote.php/dav/files/'+ resultcreate.body.session.userId+ '/' + name,
          sessionId: resultcreate.body.session.id,
          sessionToken: resultcreate.body.session.token,
          steps: steps,
          token: 0,
          version: resultcreate.body.document.currentVersion,         
        };
        this.fsService.pushNewFileText(data).subscribe((result: any) => {
          let data2 = {
            documentId: resultcreate.body.document.id,
            filePath: '/remote.php/dav/files/'+ resultcreate.body.session.userId+ '/' + name,
            force: false,
            manualSave: false,
            sessionId: resultcreate.body.session.id,
            sessionToken: resultcreate.body.session.token,
            token: null,
            version: resultcreate.body.document.currentVersion,
          };
          this.fsService.fileSync(data2).subscribe((result: any)=> {
            let data3 = {
              autosaveContent: this.resultText,
              documentId: resultcreate.body.document.id,
              filePath: '/remote.php/dav/files/'+ resultcreate.body.session.userId+ '/' + name,
              force: false,
              manualSave: false,
              sessionId: resultcreate.body.session.id,
              sessionToken: resultcreate.body.session.token,
              token: null,
              version: result.body.document.currentVersion,
            };
            this.fsService.fileSync(data3).subscribe((result: any)=> {
              this.fsService.closeSession(fileid, name).subscribe((result: any) => {
                this.isClosingOut.emit(true);
              });
            });
          });
        });
      });    
  }

  buildSteps(){
    let steps = [];

    for(var i=0; i<this.resultText.length; i++){
      let obj =
      {
        stepType: 'replace',
        from: i+1,
        to: i+1,
        slice: {
          content: [
            {
              type: 'text',
              text: this.resultText[i],              
            }
          ]
        }
      };

      steps.push(obj);
    }
    
    return steps;
  }

   //----------------------//
  //------- TOGGLE -------//
 //----------------------//

  /** TOGGLE NEW FOLDER
   * Open/close new folders name input
   **/
  toggleNewFolder(){
    if(!this.checkNameFolder){
      this.checkNameFile = false;
      this.checkNameDocument = false;
      this.checkNameExel = false;
      this.checkNamePower = false;
    }
    this.checkNameFolder = !this.checkNameFolder;
  }

  /** TOGGLE NEW FILE TXT
   * Open/close new files name input
   **/
  toggleNewFile(){
    if(!this.checkNameFile){
      this.checkNameFolder = false;
      this.checkNameDocument = false;
      this.checkNameExel = false;
      this.checkNamePower = false;
    }
    this.checkNameFile = !this.checkNameFile;
  }

  /** TOGGLE NEW DOCUMENT
   * Open/close new document name input
   **/
  toggleNewDocument(){
    if(!this.checkNameDocument){
      this.checkNameFolder = false;
      this.checkNameFile = false;
      this.checkNameExel = false;
      this.checkNamePower = false;
    }
    this.checkNameDocument = !this.checkNameDocument;
  }

  /** TOGGLE NEW EXEL
   * Open/close new exel name input
   **/
  toggleNewExel(){
    if(!this.checkNameExel){
      this.checkNameFolder = false;
      this.checkNameFile = false;
      this.checkNameDocument = false;
      this.checkNamePower = false;
    }
    this.checkNameExel = !this.checkNameExel;
  }

  /** TOGGLE NEW POWER
   * Open/close new powerpoint name input
   **/
  toggleNewPower(){
    if(!this.checkNamePower){
      this.checkNameFolder = false;
      this.checkNameFile = false;
      this.checkNameDocument = false;
      this.checkNameExel = false;
    }
    this.checkNamePower = !this.checkNamePower;
  }

  toggleUpload(){
    this.checkNameFolder = false;
    this.checkNameFile = false;
    this.checkNameDocument = false;
    this.checkNameExel = false;
    this.checkNamePower = false;
  }

  /** CHECK EMPTY
   * Check empty name
   * @param name (string) name new file/folder
   **/
  checkEmpty(name: string){
    if(!name || name.length==0){
      this._snackBar.open(this.langService.dictionary.no_name, '', {
        duration: 4000,
        panelClass: 'toast-error'
      });
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

    if(this.data.length>0){
      for(var a in this.data){
        if(this.data[a].extension == extension){
          if(this.data[a].name == value || this.data[a].name.slice(0, this.data[a].name.lastIndexOf(' ')) == value) arrayCheck.push(this.data[a]);
        }
      }
    }
    
    if(arrayCheck.length == 0) name = value;
    else if(arrayCheck.length >= 1) name = value + ' (' + arrayCheck.length + ')';

    return name;
  }

  /** CREATE NEW FOLDER
   * @param name name new folder
   * Send data to table
   **/
  createNewFolder(name){
    let isEmpty = this.checkEmpty(name);
    if(isEmpty) return;

    let exist = false;
    if(this.data.length>0){
      for(var i in this.data){
        if(this.data[i].name == name && !this.data[i].file){
          exist = !exist;
          break;
        }
      }
    }    

    if(exist){
      this._snackBar.open(this.langService.dictionary.folder_exist, '', {
        duration: 4000,
        panelClass: 'toast-error'
      });
      return;
    }

    let data = {
      type: 'folder',
      data: name
    };
    this._uploadLink.toggle(data);
    this.isClosingOut.emit(true);
  }

  /** CREATE NEW FILE
   * @param name name new file
   * Send data to table
   **/
  createNewFile(name){
    let isEmpty = this.checkEmpty(name);
    if(isEmpty) return;

    let exist = false;
    if(this.data.length>0){
      for(var i in this.data){
        if(this.data[i].name == name && this.data[i].extension == '.txt'){
          exist = !exist;
          break;
        }
      }
    }    

    if(exist){
      this._snackBar.open(this.langService.dictionary.file_exist, '', {
        duration: 4000,
        panelClass: 'toast-error'
      });
      return;
    }

    name = name + '.txt';    
    this.fsService.createFilePublic(name, this.authorization).subscribe((result: any) => {
      this.fsService.dataFilePublic(name, this.authorization).subscribe((result: any) => {
        let fileid = result.body.multistatus.response.propstat[0].prop.fileid;
        this.fsService.createSession(fileid, name).subscribe((resultcreate: any) => {
          this.openTextEditor(fileid, name, resultcreate);
        });       
      });
    });
  }

  /** CREATE NEW DOCUMENT
   * Create new docx with only office, then open it in blank page and close sidebar list
   * Check if empty and if name file alredy exist
   * @param value (string) file name 
   */
  createNewDocument(value: string){
    let isEmpty = this.checkEmpty(value);
    if(isEmpty) return;

    let name = this.checkExistence(value, '.docx');
    let home = (this.route.snapshot.queryParams.path)? decodeURIComponent(this.route.snapshot.queryParams.path) : '/';
    let data = {
      type: 'oofile',
      data: {name: name + '.docx', home : home}
    };
    this._uploadLink.toggle(data);
    this.isClosingOut.emit(true);
  }

  /** CREATE NEW EXEL
   * Create new xlsx with only office, then open it in blank page and close sidebar list
   * @param value (string) file name 
   */
  createNewExel(value: string){
    let isEmpty = this.checkEmpty(value);
    if(isEmpty) return;

    let name = this.checkExistence(value, '.xlsx');
    let home = (this.route.snapshot.queryParams.path)? decodeURIComponent(this.route.snapshot.queryParams.path) : '/';
    let data = {
      type: 'oofile',
      data: {name: name + '.xlsx', home : home}
    };
    this._uploadLink.toggle(data);
    this.isClosingOut.emit(true);
  }

  /** CREATE NEW POWER
   * Create new pptx with only office, then open it in blank page and close sidebar list
   * @param value (string) file name 
   */
  createNewPower(value: string){
    let isEmpty = this.checkEmpty(value);
    if(isEmpty) return;

    let name = this.checkExistence(value, '.pptx');
    let home = (this.route.snapshot.queryParams.path)? decodeURIComponent(this.route.snapshot.queryParams.path) : '/';
    let data = {
      type: 'oofile',
      data: {name: name + '.pptx', home : home}
    };
    this._uploadLink.toggle(data);
    this.isClosingOut.emit(true);
  }

}
