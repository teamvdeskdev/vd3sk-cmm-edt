import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LanguageService } from 'src/app/app-services/language.service';
import { globals } from 'src/config/globals';
import { AssociatedUser } from '../reminders-page.component';
import { RemindersPageService } from '../reminders-page.service';

@Component({
  selector: 'app-filter-post-it-dialog',
  templateUrl: './filter-post-it-dialog.component.html',
  styleUrls: ['./filter-post-it-dialog.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-EN'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class FilterPostItDialogComponent implements OnInit, OnDestroy {
  filterPostItForm: FormGroup;
  associatedUsers: AssociatedUser[];
  appliedFiltersCounter = 0;
  labelAssociatedUsers: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FilterPostItDialogComponent>,
    public langService: LanguageService,
    private adapter: DateAdapter<any>,
    private remindersPageService: RemindersPageService
  ) {
    this.filterPostItForm = new FormGroup({
      startDateControl: new FormControl(data && data.previousFilterData ? data.previousFilterData.startDateControl : null),
      endDateControl: new FormControl(data && data.previousFilterData ? data.previousFilterData.endDateControl : null),
      associatedUsersControl: new FormControl(data && data.previousFilterData ? data.previousFilterData.associatedUsersControl : []),
      personalRemindersCheck: new FormControl(data && data.previousFilterData ? data.previousFilterData.personalRemindersCheck : true),
      sharedRemindersCheck: new FormControl(data && data.previousFilterData ? data.previousFilterData.sharedRemindersCheck : true)
    }, { validators: checkboxFilterValidator });

    if (this.data) {
      this.associatedUsers = this.data.associatedUsers;
      if (!this.associatedUsers || (this.associatedUsers && this.associatedUsers.length < 1)) {
        this.labelAssociatedUsers = this.langService.dictionary.placeholderNoAssociatedUsers;
      } else {
        this.labelAssociatedUsers = this.langService.dictionary.placeholderAssociatedUsers;
      }
    }
    // calendar locale
    const userLang = sessionStorage.getItem('user_language');
    this.adapter.setLocale(userLang);
  }

  ngOnInit() {
    this.remindersPageService.resetFilter.subscribe((result: any) => {
      if (typeof result === 'boolean') {
        if (result) {
          this.remindersPageService.resetFilter.next(null);
          this.onResetFilterClick();
        }
      }
    });
  }

  getUserAvatar(userId: string) {
    let profilePicUrl = null;
    if (userId) {
      profilePicUrl = `${globals.endpoint}/setting/info/avatar/getavatar?user=` + userId + `&size=23`;
    }
    return profilePicUrl;
  }

  onFilterClick() {
    if (this.filterPostItForm.valid) {
      this.dialogRef.close({
        data: this.filterPostItForm,
        counterAppliedFilters: this.countAppliedFilters(),
        buttonType: 'filter'
      });
    }
  }

  countAppliedFilters() {
    let count = 0;
    const startDate = this.filterPostItForm.get('startDateControl').value;
    const endDate = this.filterPostItForm.get('endDateControl').value;
    const associatedUsers = this.filterPostItForm.get('associatedUsersControl').value;
    const personalRemindersCheck = this.filterPostItForm.get('personalRemindersCheck').value;
    const sharedRemindersCheck = this.filterPostItForm.get('sharedRemindersCheck').value;
    if (startDate || endDate) {
      count += 1;
    }
    if (associatedUsers && associatedUsers.length > 0) {
      count += 1;
    }
    if (personalRemindersCheck === false || sharedRemindersCheck === false) {
      count += 1; // una delle due checkbox è sempre selezionata e valgono entrambi come 1 filtro applicato
    }
    return count;
  }

  onResetFilterClick() {
    this.appliedFiltersCounter = 0;
    // close popup
    this.dialogRef.close({
      data: null,
      buttonType: 'resetFilter'
    });
  }

  onCloseClick() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.remindersPageService.resetFilter.next(null);
  }
}

export const checkboxFilterValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const personalRemindersValue = control.get('personalRemindersCheck').value;
  const sharedRemindersValue = control.get('sharedRemindersCheck').value;
  return !personalRemindersValue && !sharedRemindersValue ? { unchecked: true } : null;
};
