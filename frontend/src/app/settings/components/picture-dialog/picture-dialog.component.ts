import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCroppedEvent, base64ToFile, CropperPosition } from 'ngx-image-cropper';
import { LanguageService } from '../../services/language.service';
import { SystemSettingsService } from '../../services/system-settings.service';

@Component({
  selector: 'app-picture-dialog',
  templateUrl: './picture-dialog.component.html',
  styleUrls: ['./picture-dialog.component.scss']
})
export class PictureDialogComponent implements OnInit {

  imageChangedEvent: any = '';
  croppedImage: any = '';
  uploadedImage: any;
  bigImageError = 'The image is too big. Please, choose an image smaller than 20 MB';
  loadedIMG = false;
  croppedImageWidth: number;
  croppedImageHeight: number;
  croppedImageX: number;
  croppedImageY: number;

  constructor(
    public dialogRef: MatDialogRef<PictureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private zone: NgZone,
    public langService: LanguageService
    ) { }

  ngOnInit() {
    if (this.data.target.files[0].size <= 20971520) {
      this.zone.run(() => {
        this.loadedIMG = true;
        this.imageChangedEvent = this.data;
      });

    } else {
      this.loadedIMG = false;
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;

    this.croppedImageX = event.cropperPosition.x1;
    this.croppedImageY = event.cropperPosition.y1;
    this.croppedImageWidth = event.width;
    this.croppedImageHeight = event.height;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  save() {
    const dta = {
      x: this.croppedImageX,
      y: this.croppedImageY,
      w: this.croppedImageWidth,
      h: this.croppedImageHeight,
    };
    if (this.croppedImageWidth !== this.croppedImageHeight) {
      dta.w = this.croppedImageHeight;
    }

    this.dialogRef.close(dta);
  }

}
