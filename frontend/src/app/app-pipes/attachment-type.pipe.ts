import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'attachmentType'
})
export class AttachmentTypePipe implements PipeTransform {

  types = {
    txt: 'notes',
    rtf: 'notes',
    ics: 'insert_drive_file',

    xls: 'border_all',
    xlsx: 'border_all',
    ods: 'border_all',

    doc: 'format_align_left',
    docx: 'format_align_left',
    odt: 'format_align_left',

    ppt: 'desktop_windows',
    pptx: 'desktop_windows',
    odp: 'desktop_windows',

    mp4: 'movie_creation',
    avi: 'movie_creation',
    mov: 'movie_creation',
    mpg: 'movie_creation',
    mpeg: 'movie_creation',
    webm: 'movie_creation',
    webv: 'movie_creation',
    ogg: 'movie_creation',
    ogv: 'movie_creation',
    '3gp': 'movie_creation',
    '3g2': 'movie_creation',

    gif: 'image',
    png: 'image',
    jpg: 'image',
    jpeg: 'image',
    bmp: 'image',
    tif: 'image',
    tiff: 'image',
    webp: 'image',
    svg: 'image',

    pdf: 'picture_as_pdf',

    aac: 'music_note',
    mid: 'music_note',
    midi: 'music_note',
    mp3: 'music_note',
    oga: 'music_note',
    weba: 'music_note',
    wav: 'music_note',
    opus: 'music_note',
  };

  transform(value: any, ...args: any[]): any {
    return !!this.types[value] ? this.types[value] : 'insert_drive_file';
  }
}
