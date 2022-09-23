import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toCleanString'
})
export class CleanPipe implements PipeTransform {

  transform(value: string, ...args: any[]): string {
    if (value.includes('.d')) {
      const indexdotd = value.indexOf('.d');
      const cleanValue = value.slice(0, indexdotd);
      return cleanValue
    } else {
      return value;
    }
  }

}
