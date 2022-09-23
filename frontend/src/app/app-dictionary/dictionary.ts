/*
 * DICTIONARY
 * Manage all languages change of the project
 * Need to create a new .ts file in dictionary folder if more languages are needed (EX. dictionaryEN)
 * Import every dictionary created
 */
import * as DictionaryIT from './dictionaryIT';
import * as DictionaryEN from './dictionaryEN';
import { DictionaryInterface } from './dictionary.interface';

/*
 * userLanguage     -> get user language from settings or browser
 * currentLanguage  -> get last 2 characters of language const in lower case (used in getDictionay)
 * dictionary       -> final result of the function (translated keyword)
 */
export class Dictionary {
    userLanguage: string;
    currentLanguage: string;
    dictionary: DictionaryInterface;

    constructor() {
        if (sessionStorage.getItem('user_language')) {
            this.userLanguage = sessionStorage.getItem('user_language');
        } else {
            this.userLanguage = navigator.language;
        }

        if (this.userLanguage) {
            this.currentLanguage = this.userLanguage.substring(this.userLanguage.length - 2, this.userLanguage.length).toLowerCase();
        }

        switch (this.currentLanguage) {
            case 'it':
                this.dictionary = new DictionaryIT.Dictionary();
                break;
            default:
                this.dictionary = new DictionaryEN.Dictionary();
                break;
        }
    }
}
