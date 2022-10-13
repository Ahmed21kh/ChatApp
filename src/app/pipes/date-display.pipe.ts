import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from 'firebase/firestore';

@Pipe({
  name: 'dateDisplay',
})
export class DateDisplayPipe implements PipeTransform {
  constructor(private datepipe: DatePipe) {}

  transform(value: Timestamp | undefined): string {
    return this.datepipe.transform(value?.toMillis(), 'short') ?? '';
  }
}
