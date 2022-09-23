import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardEventsService {

  vcanvasAppLaunched: EventEmitter<any>;

  constructor() {
    this.vcanvasAppLaunched = new EventEmitter();
  }

  onVcanvasAppClick(event: Event, app) {
    event.stopPropagation();

    this.vcanvasAppLaunched.emit(app);
    // this.vcanvasAppLaunched.next(app);
  }
}
