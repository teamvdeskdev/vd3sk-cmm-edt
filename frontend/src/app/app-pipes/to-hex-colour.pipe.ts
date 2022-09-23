import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toHexColour'
})
export class ToHexColourPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return this.intToARGB(this.hashCode(value));
  }
  // Convert an int to hexadecimal with a max length
  // of six characters.
  intToARGB(i) {
    var hex = ((i >> 24) & 0xFF).toString(16) +
      ((i >> 16) & 0xFF).toString(16) +
      ((i >> 8) & 0xFF).toString(16) +
      (i & 0xFF).toString(16);
    // Sometimes the string returned will be too short so we 
    // add zeros to pad it out, which later get removed if
    // the length is greater than six.
    hex += '000000';
    return hex.substring(0, 6);
  }
  // Hash any string into an integer value
  // Then we'll use the int and convert to hex.
  hashCode(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

}
