import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private secretKey = 'VDsp16!PtleCA';

  constructor() { }

  // Plain Text Encryption
  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.secretKey).toString();
  }

  // Plain Text Decryption
  decrypt(textToDecrypt: string) {
    return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey).toString(CryptoJS.enc.Utf8);
  }

  // Object Encryption
  encryptObj(data: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
  }

  // Object Decryption
  decryptObj(textToDecrypt: string) {
    const bytes = CryptoJS.AES.decrypt(textToDecrypt, this.secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

}
