import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { startWith } from 'rxjs/operators';
import { LanguageService } from 'src/app/app-services/language.service';
import { ShareService } from 'src/app/file-sharing/services/share.service';
import { Utilities } from 'src/app/file-sharing/utilities';

@Component({
  selector: 'app-add-post-it-dialog',
  templateUrl: './add-post-it-dialog.component.html',
  styleUrls: ['./add-post-it-dialog.component.scss']
})
export class AddPostItDialogComponent implements OnInit {
  newPostItForm: FormGroup;
  filteredUsers: any = [];
  shareUsersSelected: any = [];
  util = new Utilities();
  userIsSearching = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddPostItDialogComponent>,
    private shareService: ShareService,
    public langService: LanguageService
  ) { }

  ngOnInit(): void {
    this.newPostItForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(72)]),
      shareInput: new FormControl('')
    });

    this.autocompleteUserShare();
  }

  autocompleteUserShare() {
    this.newPostItForm.get('shareInput').valueChanges
      .pipe(startWith(''))
      .subscribe(term => {
        if (term && term.length >= 3) {
          this.userIsSearching = true;
          this.shareService.searchUserForShare(term).subscribe(response => {
            this.userIsSearching = false;
            let users: any[] = [];
            users = this.util.getResponseUserListShare(response.body.ocs.data.users);
            let exact: any[] = [];
            exact = response.body.ocs.data.exact;

            if (exact.length > 0 && !(typeof (exact) === 'object')) {
              this.filteredUsers = exact;
            } else {
              this.filteredUsers = users;
            }
          });
        } else {
          this.filteredUsers = [];
        }
      });
  }

  displayFn(user: any) {
    return user && user.label ? user.label : '';
  }

  onSelectUser(value: any) {
    if (value) {
      this.shareUsersSelected.push(value);
      this.newPostItForm.get('shareInput').disable();
    }
  }

  removeUserSelected(user: any) {
    if (user) {
      const index = this.shareUsersSelected.indexOf(user);
      if (index > -1) {
        this.shareUsersSelected.splice(index, 1);
        this.newPostItForm.get('shareInput').setValue('');
        this.newPostItForm.get('shareInput').enable();
      }
    }
  }

  onConfirmClick(): void {
    if (this.newPostItForm.valid) {
      this.newPostItForm.get('shareInput').setValue(this.shareUsersSelected.map(u => u.id));
      const data: AddPostItDialogModel = {
        status: 'Confirm',
        value: this.newPostItForm.getRawValue()
      };
      this.dialogRef.close(data);
    }
  }

  onNoClick(): void {
    const data: AddPostItDialogModel = {
      status: 'Cancel'
    };
    this.dialogRef.close(data);
  }
}

export class AddPostItDialogModel {
  public status: string;
  public value?: any;
}
