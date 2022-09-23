import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'acronym'
})
export class AcronymPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    var matches = value.match(/\b(\w)/g); // array of initials
    let acronym = '';
    if (matches) {
      if (matches.length > 2) {
        acronym = matches[0] + matches[1];
      } else {
        acronym = matches.join('');
      }
    }
    return acronym;
  }

}
