import { Pipe, PipeTransform } from '@angular/core';
import { PostItDto } from '../app-model/dashboard/CreateUpdatePostItResponse';

@Pipe({
  name: 'searchPostIt'
})
export class SearchPostItPipe implements PipeTransform {

  transform(items: PostItDto[], searchText: string): PostItDto[] {
    if (items && searchText) {
      return items.filter(i => i.title.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) ||
        i.body.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()));
    }
    return items;
  }
}
