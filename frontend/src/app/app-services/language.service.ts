import { Injectable } from '@angular/core';
import { Dictionary } from '../app-dictionary/dictionary';
import { DictionaryInterface } from '../app-dictionary/dictionary.interface';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  dictionary: DictionaryInterface;

  constructor() {
    this.dictionary = new Dictionary().dictionary;
  }

  refreshDictionary() {
    this.dictionary = new Dictionary().dictionary;
  }
}
