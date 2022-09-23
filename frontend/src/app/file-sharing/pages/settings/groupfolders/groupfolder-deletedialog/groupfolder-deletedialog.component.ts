import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Dictionary } from '../../../../dictionary/dictionary';
import { globals } from 'src/config/globals';

@Component({
  selector: 'app-groupfolder-deletedialog',
  templateUrl: './groupfolder-deletedialog.component.html',
  styleUrls: ['./groupfolder-deletedialog.component.scss']
})
export class GroupfolderDeletedialogComponent implements OnInit {
  dict = new Dictionary();

  stringTitle: string = this.dict.getDictionary('groupfolder_dialogdelete_title');
  stringBody: string;
  stringCancel: string = this.dict.getDictionary('cancel');
  stringSave: string = this.dict.getDictionary('delete-button');
  isTim: boolean;
  globalsVar: any;

  constructor(
    public dialogRef: MatDialogRef<GroupfolderDeletedialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.globalsVar = globals;
   }

  ngOnInit() {
    this.isTim = (this.globalsVar.customCustomer.toLowerCase() == 'tim')? true : false;
    if(this.isTim && !this.data.secondDialog){
      this.stringBody = this.dict.getDictionary('groupfolder_dialogdelete_firstA') + this.data.name + this.dict.getDictionary('groupfolder_dialogdelete_firstB');
    } else if(this.isTim && this.data.secondDialog) {
      this.stringBody = this.dict.getDictionary('groupfolder_dialogdelete_secondA') + this.data.name + this.dict.getDictionary('groupfolder_dialogdelete_secondB');
    } else {
      this.stringBody = this.dict.getDictionary('groupfolder_dialogdelete_bodyfirst') + this.data.name + this.dict.getDictionary('groupfolder_dialogdelete_bodysecond');
    }
  }

  onConfirmClick() {
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
