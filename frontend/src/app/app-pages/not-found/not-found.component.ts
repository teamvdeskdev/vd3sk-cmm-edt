import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/app-services/language.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(public langService: LanguageService,) { }

  ngOnInit(): void {
  }

}
