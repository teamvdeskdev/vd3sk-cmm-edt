import { Component, Input, OnInit } from '@angular/core';
import { UserDashboardModel } from 'src/app/app-model/dashboard/UserDashboardModel';
import { DashboardService } from 'src/app/app-services/dashboard.service';
import { LanguageService } from 'src/app/app-services/language.service';

@Component({
  selector: 'app-draggable-card',
  templateUrl: './draggable-card.component.html',
  styleUrls: ['./draggable-card.component.scss']
})
export class DraggableCardComponent implements OnInit {

  @Input() name: string;
  @Input() userDashboardModel: UserDashboardModel;
  orderNews: number;
  orderReminders: number;
  newsIsEnabled: boolean;

  constructor(
    public languageService: LanguageService,
    private dashboardService: DashboardService
  ) { }

  ngOnInit() {
    if (this.userDashboardModel && this.userDashboardModel.rows) {
      const findedRow = this.userDashboardModel.rows.find(row => row.isNewsSection);
      if (findedRow) {
        this.orderNews = findedRow.orderNews > 0 ? 2 : findedRow.orderNews;
        this.orderReminders = findedRow.orderReminders > 0 ? 2 : findedRow.orderReminders;
        this.newsIsEnabled = findedRow.isEnabled;
      }
    }
  }

  swapNewsReminders() {
    const temp = this.orderNews;
    this.orderNews = this.orderReminders;
    this.orderReminders = temp;
    this.dashboardService.newsOrderModule.next({orderNews: this.orderNews > 0 ? 1 : 0, orderReminders: this.orderReminders > 0 ? 1 : 0});
  }

  disableNewsArea(newsCheck: any) {
    this.dashboardService.showNewsAndReminders.next(!newsCheck.checked);
  }
}

export class OrderModule {
   public orderNews: number;
   public orderReminders: number;
}
