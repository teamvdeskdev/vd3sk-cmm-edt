import { Component, Input, OnInit } from '@angular/core';
import { FeedModel } from 'src/app/app-model/dashboard/FeedModel';
import { UtilitiesService } from 'src/app/app-services/utilities.service';

@Component({
  selector: 'app-feed-item',
  templateUrl: './feed-item.component.html',
  styleUrls: ['./feed-item.component.scss']
})
export class FeedItemComponent implements OnInit {
  @Input() data: FeedModel;
  feedElapsedTime: string;

  constructor(
    private utilitiesService: UtilitiesService
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.date) {
      const feedDate = new Date (this.data.date);
      this.feedElapsedTime = this.utilitiesService.getTimeFunc(feedDate.getTime());
    }
  }
}
