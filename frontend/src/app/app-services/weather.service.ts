import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  endpointOpenWeatherMap = 'https://api.openweathermap.org/data/2.5/weather';
  apiKey = '772e1366d90d93d579278883a380b883';
  units = 'metric';
  weatherIcons: Map<string, string>;

  constructor(private http: HttpClient) {
    this.weatherIcons = new Map([
      ['01d', 'fas fa-sun'],
      ['01n', 'fas fa-sun'],
      ['02d', 'fas fa-cloud-sun'],
      ['02n', 'fas fa-cloud-sun'],
      ['03d', 'fas fa-cloud-sun'],
      ['03n', 'fas fa-cloud-sun'],
      ['04d', 'fas fa-cloud-sun'],
      ['04n', 'fas fa-cloud-sun'],
      ['09d', 'fas fa-cloud-rain'],
      ['09n', 'fas fa-cloud-rain'],
      ['10d', 'fas fa-cloud-sun-rain'],
      ['10n', 'fas fa-cloud-sun-rain'],
      ['11d', 'fas fa-poo-storm'],
      ['11n', 'fas fa-poo-storm'],
      ['13d', 'fas fa-snowflake'],
      ['13n', 'fas fa-snowflake'],
      ['50d', 'fas fa-smog'],
      ['50n', 'fas fa-smog'],
    ]);
  }

  getWeatherData(latitude: any, longitude: any): Observable<any> {
    // tslint:disable-next-line: max-line-length
    const url = this.endpointOpenWeatherMap + `?lat=` + latitude.toString() + `&lon=` + longitude.toString() + `&units=` + this.units + `&appid=` + this.apiKey;
    return this.http.get<any>(url, {responseType: 'json'});
  }

  getWeatherIcon(iconKey: string) {
    return this.weatherIcons.get(iconKey);
  }
}
