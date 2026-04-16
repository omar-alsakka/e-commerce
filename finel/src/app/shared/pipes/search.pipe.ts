import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {
  transform(items: any[], term: string): any[] {
    if (!items || !term) {
      return items;
    }
    return items.filter(item => 
      item.title.toLowerCase().includes(term.toLowerCase())
    );
  }
}
