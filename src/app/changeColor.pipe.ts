import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'changeColor'
})
export class ChangeColorPipe implements PipeTransform {
  transform(content: string, word: string) {
    var contents = content + '';
    const splits = contents.split('');
    let result = ``;
    splits.forEach(next => {
      word === next ? result += `<span class="highlight">${next}</span>` : result += `${next}`;
    });
    return result.trim();
  }
}
