import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss']
})
export class ConfigurationsComponent implements OnInit {

  expireSessionForm: FormGroup;
  hours: number[];
  expireTimeIsChanging = false;
  isLoading = false;


  constructor(public langService: LanguageService) {

    this.hours = Array(24).fill(null).map((x, i) => i + 1);

    this.expireSessionForm = new FormGroup({
      expireTime: new FormControl('')
    });
  }

  ngOnInit() {
  }

  updateExpireTime(value: any) {

  }

}
