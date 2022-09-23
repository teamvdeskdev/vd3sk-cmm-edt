import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Dictionary } from '../../../dictionary/dictionary';
import { FileSharingService } from '../../../services/file-sharing.service';
import { Utilities } from '../../../utilities';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit {
  dict = new Dictionary();
  tooltipTextClose = this.dict.getDictionary('close');
  cancel: string;
  save: string;
  txtFileContent ='';
  done: boolean = true;

  steps: any;
  timer: any;

  public tools: object = {
    enableFloating: true,
    items: [
      'Undo', 'Redo', '|',
      'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
      'SubScript', 'SuperScript', '|',
      'LowerCase', 'UpperCase', '|',
      'Formats', 'Alignments', '|',
      'OrderedList', 'UnorderedList', '|',
      'Indent', 'Outdent', '|',
      'CreateLink', 'Image', '|', 
      'ClearFormat', 'Print', 'SourceCode', '|',
      'FullScreen', '|',
      {
        tooltipText: this.tooltipTextClose,
        undo: true,
        //click: this.closeTextEditor.bind(this),
        
      },
    ]
  };

  constructor(
    private fsService: FileSharingService,
    public dialogRef: MatDialogRef<TextEditorComponent>,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.cancel = this.dict.getDictionary('cancel');
    this.save = this.dict.getDictionary('save');
  }

  /** ON CONFIRM CLICK
   * @param $event type event
   * Send data back to sidebar
   * event : type event: 'm': move / 'c': copy
   * destination : new path of file/folder (no mane and extension)
   **/
  onConfirmClick($event: string): void {
    this.spinner.show();
    this.done = false;
    setTimeout(
      function(){
        let data = {
          filetext: this.txtFileContent,
        }
        this.dialogRef.close(data);
        this.spinner.hide();
        this.done = true;
      }.bind(this),
      5500
    );
    
  }

  /** ON NO CLICK
   * Close dialog on click or click outside dialog
   **/
  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
