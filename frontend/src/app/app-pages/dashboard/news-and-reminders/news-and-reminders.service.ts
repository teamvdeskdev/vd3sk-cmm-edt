import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class NewsAndRemindersService {
  spinnerName = 'spinnerPostIt';
  loadingTimer: any;
  loading = false;
  constructor(
    private spinner: NgxSpinnerService
  ) { }

  startLoading() {
    this.spinner.show(this.spinnerName);
    this.loading = true;
    this.loadingTimer = setTimeout(() => {
        if (this.loading) {
            this.stopLoading();
        }
    }, 1200000);
  }

  stopLoading() {
    this.spinner.hide(this.spinnerName);
    this.loading = false;
    clearTimeout(this.loadingTimer);
  }
}
