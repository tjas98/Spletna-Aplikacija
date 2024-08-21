import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prosto',
  standalone: false
})
export class ProstoPipe implements PipeTransform {

  transform(value: String, ...args: unknown[]): unknown {
    return (value == 'Prosto' ? "" : value.toUpperCase())
    
  }

}
