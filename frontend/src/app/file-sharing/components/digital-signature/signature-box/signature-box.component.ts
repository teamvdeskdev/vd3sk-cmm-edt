import { Component, OnInit, ViewChild } from '@angular/core';
import { DigitalSignatureService } from '../digital-signature.service';
import { PadesSignatureComponent } from '../pades-signature/pades-signature.component';

@Component({
  selector: 'app-signature-box',
  templateUrl: './signature-box.component.html',
  styleUrls: ['./signature-box.component.scss']
})
export class SignatureBoxComponent implements OnInit {
  @ViewChild('signatureBoxId') set content(content: HTMLElement) {
    if (content) {
      document.getElementById('signatureBoxId-' + this.id).style.width = this.widthSignature + 'px';
      document.getElementById('signatureBoxId-' + this.id).style.height = this.heightSignature + 'px';
    }
  }

  private wSize = '166';
  private hSize = '102';

  widthSignature: string;
  heightSignature: string;
  signatureImageBase64: string;
  id: number;
  pageNumber: number;
  signatureOrigX: number;
  signatureOrigY: number;
  inBounds = false;
  showDeleteSignatureBtn = false;
  settedOriginPos = false;
  draggable: boolean;
  positionSignature: any;
  bounds: any;
  parentRef: PadesSignatureComponent;

  constructor(
    private digitalSignatureService: DigitalSignatureService
  ) { }

  ngOnInit() {
    let xValue = 0;
    let yValue = 0;

    if (this.positionSignature && this.positionSignature.x && this.positionSignature.y) {
      xValue = this.positionSignature.x;
      yValue = this.positionSignature.y;
    }
    this.positionSignature = {x: xValue, y: yValue};

    if (!this.widthSignature && !this.heightSignature) {
      this.widthSignature = this.wSize;
      this.heightSignature = this.hSize;
    }
  }

  onDragBegin(event: any) {
    if (!this.settedOriginPos) {
      this.setOriginSignatureViewPosition();
      this.digitalSignatureService.dragSignatureEvent(event);
    }
    this.showDeleteSignatureBtn = true;
    this.inBounds = true;
  }

  setOriginSignatureViewPosition() {
    // set della posizione iniziale della firma (serve per gli spostamenti sulla view)
    const signBox = document.getElementById('signatureBoxId-' + this.id).getBoundingClientRect();
    this.signatureOrigX = signBox.left;
    this.signatureOrigY = signBox.top;
    this.settedOriginPos = true;
    this.digitalSignatureService.setSignatureOriginCoord(this.signatureOrigX, this.signatureOrigY);
  }

  deleteSignatureBtn() {
    this.resetSignaturePosition();
  }

  resetSignaturePosition() {
    this.parentRef.remove(this.id, true);
    this.positionSignature = { x: 0, y: 0 };
    this.showDeleteSignatureBtn = false;
    this.inBounds = false;
    this.widthSignature = this.wSize;
    this.heightSignature = this.hSize;
  }
}
