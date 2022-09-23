import { Injectable } from '@angular/core';
import { Dictionary } from '../dictionary/dictionary';
import { DictionaryInterface } from '../dictionary/dictionary.interface';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  public dictionary: DictionaryInterface;

  constructor() {
    this.dictionary = new Dictionary().dictionary;
  }

  refreshDictionary() {
    this.dictionary = new Dictionary().dictionary;
  }
}
