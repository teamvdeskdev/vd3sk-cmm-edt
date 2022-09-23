import { Directive, Output, Input, EventEmitter, HostBinding, HostListener } from '@angular/core';
import { Utilities } from '../utilities';
import { Dragdroputils } from 'src/app/file-sharing/services/dragdroputils';
import { TableComponentLink } from 'src/app/app-pages/external-sharedbylink/components/table/table.component';
import { CreateService } from 'src/app/file-sharing/services/sidebar.service';

@Directive({
  selector: '[appDropFile]'
})
export class DropFileDirective {

  @Output() onFileDropped = new EventEmitter<any>();

  util = new Utilities();

  constructor(
    private _dragdrop: Dragdroputils,
    private _create: CreateService,
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
  @HostListener('drop', ['$event']) public async ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.opacity = '1';
    var entry = [], items = [];

    for(var a in evt.dataTransfer.files){
      if(!isNaN(parseInt(a))){
        entry.push(evt.dataTransfer.files[a]);
        items.push(evt.dataTransfer.items[a].webkitGetAsEntry());
      } 
    }

    if(entry.length>0){
      let data = {
        name: '',
        type: 'dragdrop',
        data: {entry: entry, items: items}
      };      
      this._create.toggle(data);
    }
  }
}