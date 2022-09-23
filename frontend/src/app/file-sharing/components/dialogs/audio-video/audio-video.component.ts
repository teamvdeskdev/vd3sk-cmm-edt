import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Utilities } from '../../../utilities';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { globals } from 'src/config/globals';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-audio-video',
  templateUrl: './audio-video.component.html',
  styleUrls: ['./audio-video.component.scss']
})
export class AudioVideoComponent implements OnInit {
  util = new Utilities();
  type: string;
  control: string;
  src: string;
  baseurl = `${globals.endpoint}/`;
  url: any;

  constructor(
    public dialogRef: MatDialogRef<AudioVideoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private domSanitizer: DomSanitizer,
  ) { 
    if (data) {
      var reader = new FileReader();
      reader.readAsDataURL(data.href);
      if(data.data.typecomplete.indexOf('image')> -1){
        this.control = 'image';
      } else if(data.data.typecomplete.indexOf('video')> -1){
        this.control = 'video';
      }else if(data.data.typecomplete.indexOf('audio')> -1){
        this.control = 'audio';
      }

      let file = data.href;
      var URL = window.URL;
      this.url = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
    }
  }

  ngOnInit() {
    
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
