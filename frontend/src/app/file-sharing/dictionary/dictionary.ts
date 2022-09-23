/*
 * DICTIONARY
 * Manage all languages change of the project
 * Need to create a new .ts file in dictionary folder if more languages are needed (EX. dictionaryEN)
 * Import every dictionary created
 */
import * as DictionaryIT from './dictionaryIT';
import * as DictionaryEN from './dictionaryEN';

/*
 * userLanguage     -> get user language from settings or browser
 * currentLanguage  -> get last 2 characters of language const in lower case (used in getDictionay)
 * dictionary       -> final result of the function (translated keyword)
 */
export class Dictionary {
    userLanguage;
    currentLanguage;
    dictionary;

    constructor() {
        this.userLanguage = sessionStorage.getItem('user_language');
        if (this.userLanguage) {
            this.currentLanguage = this.userLanguage.substring(this.userLanguage.length - 2, this.userLanguage.length).toLowerCase();
        }
        this.dictionary = '';
    }

    /*
     * getDictionary is a public function that get a keyword to translate
     * Return the translated word after recovering it in the specific dictionary file
     */
    public getDictionary(key: any) {
        switch (this.currentLanguage) {
            case 'it':
                 this.dictionary = DictionaryIT.dictionary[key];
                 break;
            default:
                 this.dictionary = DictionaryEN.dictionary[key];
                 break;
        }
        return this.dictionary;
    }
}
