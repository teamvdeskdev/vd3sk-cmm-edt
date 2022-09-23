import { Component, OnInit, Input } from '@angular/core';
import { LanguageService } from 'src/app/app-services/language.service';

@Component({
  selector: 'app-no-card-data',
  templateUrl: './no-card-data.component.html',
  styleUrls: ['./no-card-data.component.scss']
})
export class NoCardDataComponent implements OnInit {

  @Input() app: string;
  card: string;
  url = '';

  dictMessage: string;

  constructor(public langService: LanguageService) { }

  ngOnInit() {
    if (this.app.includes('/')) { // CASE OF VSHARE CARDS
      const temp = this.app.split('/');
      this.url = 'assets/icons/no-content-icon/' + temp[0] + '.png';
      this.card = temp[1];

      this.dictMessage = this.langService.dictionary['no_card_data_' + this.card];

    } else { // CASE NO VSHARE CARD
      this.url = 'assets/icons/no-content-icon/' + this.app + '.png';

      this.dictMessage = this.langService.dictionary['no_card_data_' + this.app];
    }
  }

}
