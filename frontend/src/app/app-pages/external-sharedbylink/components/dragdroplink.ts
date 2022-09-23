import { Directive, Output, Input, EventEmitter, HostBinding, HostListener } from '@angular/core';
import { Utilities } from 'src/app/file-sharing/utilities';
import { Dragdroputils } from 'src/app/file-sharing/services/dragdroputils';
import { TableComponentLink } from 'src/app/app-pages/external-sharedbylink/components/table/table.component';
import { UploadLink } from 'src/app/app-pages/external-sharedbylink/components/services/link.service';

@Directive({
  selector: '[appDropFileLink]'
})
export class DropFileLink {

  @Output() onFileDropped = new EventEmitter<any>();

  util = new Utilities();

  constructor(
    private _dragdrop: Dragdroputils,
    private _uploadLink: UploadLink,
  ){
    
  }

  //@HostBinding('style.background-color') private background = '#f5fcff'
  @HostBinding('style.opacity') public opacity = '1'

  //Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    //  this.background = '#9ecbec';
    this.opacity = '0.8';
  }

  //Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    //   this.background = '#f5fcff'
    this.opacity = '1'
  }

  //Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.opacity = '1';

    var files: any;

    var entry = evt.dataTransfer.items[0].webkitGetAsEntry();

    files = this._dragdrop.getUploadedFiles(evt, '', '');
    files.then((result: any) => {
      var folderObj = ( !! evt.dataTransfer.files) ? evt.dataTransfer.files : '';
      let data = {
        type: 'upload',
        data: { files: folderObj, isFolder: entry.isDirectory, folderObj: folderObj }
      };
      this._uploadLink.toggle(data);  
    });
  }
}