import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: any, limit): any {
    return (value.length > limit) ? value.slice(0, limit) +'...': (value);
  }

}
