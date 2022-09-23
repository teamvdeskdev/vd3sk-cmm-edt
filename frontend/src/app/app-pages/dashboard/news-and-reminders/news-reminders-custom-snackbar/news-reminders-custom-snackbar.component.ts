import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-news-reminders-custom-snackbar',
  templateUrl: './news-reminders-custom-snackbar.component.html',
  styleUrls: ['./news-reminders-custom-snackbar.component.scss']
})
export class NewsRemindersCustomSnackbarComponent implements OnInit {

  constructor(
    private snackBarRef: MatSnackBarRef<NewsRemindersCustomSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public message: any
  ) { }

  ngOnInit(): void {
  }

  snackbarCloseBtn() {
    this.snackBarRef.dismiss();
  }

}
