import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/app-services/weather.service';

@Component({
  selector: 'app-time-weather',
  templateUrl: './time-weather.component.html',
  styleUrls: ['./time-weather.component.scss']
})
export class TimeWeatherComponent implements OnInit {

  cityName: string;
  weatherTemp: string;
  weatherIcon: string;
  dayName: string;
  todayDate: string;
  time: string;
  daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  daysIt = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

  constructor(
    private weatherService: WeatherService,
    private datePite: DatePipe
  ) { }

  ngOnInit(): void {
    this.initDateClockWeather();
  }

  initDateClockWeather() {
    this.cityName = sessionStorage.getItem('city_name') ? sessionStorage.getItem('city_name') : '';
    this.weatherTemp = sessionStorage.getItem('weather_temp') ? Number(sessionStorage.getItem('weather_temp')).toFixed(0) : '';
    // tslint:disable-next-line: max-line-length
    this.weatherIcon = sessionStorage.getItem('weather_icon') ? this.weatherService.getWeatherIcon(sessionStorage.getItem('weather_icon')) : '';
    this.timeCalc();
  }

  timeCalc() {
    const self = this;
    (function timeFn() {
      const today = new Date();
      const userLang = sessionStorage.getItem('user_language');
      if (userLang === 'it' || userLang === 'it-IT') {
        self.dayName = self.daysIt[today.getDay()];
      } else {
        self.dayName = self.daysEn[today.getDay()];
      }
      self.todayDate = self.datePite.transform(today, 'dd/MM/yyyy');
      self.time = self.addZero(today.getHours()) + ':' + self.addZero(today.getMinutes()) + ':' + self.addZero(today.getSeconds());
      setTimeout(timeFn, 1000);
    })();
  }

  addZero(i: any) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }

}
