import { Injectable } from '@angular/core';
import { Dictionary } from '../app-dictionary/dictionary';
import { globals } from 'src/config/globals';
import { LanguageService } from './language.service';
import { time } from 'console';
import { T } from '@angular/cdk/keycodes';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  calendarColorPalette = ['#82b0d0', '#e594b2', '#bbc574', '#6ec9a7', '#796ec9', '#3780b2', '#a637b2', '#43b237', '#b26937', '#d9648f'];

  // Data for date functional (dict, dict, timestamp)
  objDate = [
    { singular: 'year_ago', plural: 'years_ago', value: 31536000 },
    { singular: 'month_ago', plural: 'months_ago', value: 2628000 },
    { singular: 'week_ago', plural: 'weeks_ago', value: 604800 },
    { singular: 'day_ago', plural: 'days_ago', value: 86400 },
    { singular: 'hour_ago', plural: 'hours_ago', value: 3600 },
    { singular: 'minute_ago', plural: 'minutes_ago', value: 60 }
  ];

  // Data for getImage() method
  allData = {
    audio: ['.aac', '.mid', '.midi', '.mp3', '.oga', '.weba', '.wav', '.opus'],
    text: ['.abw', '.doc', '.docx', '.odt'],
    archive: ['.arc', '.bz', '.bz2', '.gz', '.7z', '.tar'],
    video: ['.avi', '.mpeg', '.mp4', '.ogv', '.webv', '.3gp', '.3g2'],
    ebook: ['.azw', '.epub'],
    binary: ['.bin'],
    image: ['.bmp', '.gif', '.tif', '.tiff', '.jpeg', '.jpg', '.webp', '.png', '.svg'],
    hypertext: ['.htm', '.html'],
    spredsheet: ['.xls', '.xlsx', '.ods'],
    richtext: ['.txt', '.rtf', '.md'],
    font: ['.eot', '.woff', '.woff2', '.ttf', '.otf'],
    script: ['.csh'],
    css: ['.css'],
    csv: ['.csv'],
    icon: ['.ico'],
    xml: ['.xml', '.xhtml', '.xul'],
    calendar: ['.ics'],
    powerpoint: ['.odp', '.ppt', '.pptx', '.pps', '.ppsx'],
    coding: ['.js', '.json', '.jsonld', '.mjs', '.php', '.sh'],
    pdf: ['.pdf'],
    visio: ['.vsd'],
    compressed: ['.zip', '.rar'],
    svg: ['.svg', '.eps', '.ai'],
  };

  constructor(public langService: LanguageService) { }

  getRandomString(length: number) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  getRandomHashColor() {
    return this.calendarColorPalette[Math.floor(Math.random() * this.calendarColorPalette.length)];
  }
  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  downloadVcfString(vcfString) {
    var vcfBlob = new Blob([vcfString], {
      type: 'text/x-vcard'
    });
    var blobUrl = URL.createObjectURL(vcfBlob);

    this.openBlobUrl(blobUrl, 'text/x-vcard');
  }
  
  b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  openBlobUrl(blobUrl, filename) {
    var a: any = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = blobUrl;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(blobUrl);
    // window.location = blobUrl;
  }
  escapeSpecialCharacter(s) {
    var el = document.createElement("div");
    el.innerText = el.textContent = s;
    s = el.innerHTML;
    return s;
  }
  getFreqByRrule(rrule: string) {
    var re = new RegExp("FREQ=(.*?);");

    var word = rrule;

    return !!word ? word.match(re)[1] : false;
  }
  getRepeatLabelByRRule(rrule: string) {
    /**
     *  freq        = "SECONDLY" / "MINUTELY" / "HOURLY" / "DAILY"
             / "WEEKLY" / "MONTHLY" / "YEARLY"
     */
    var re = new RegExp("FREQ=(.*?);");

    var word = rrule;

    var recurrence = !!word ? word.match(re)[1] : false;
    var freq = {
      SECONDLY: this.langService.dictionary.secondly,
      MINUTELY: this.langService.dictionary.minutely,
      HOURLY: this.langService.dictionary.hourly,
      DAILY: this.langService.dictionary.daily,
      WEEKLY: this.langService.dictionary.weekly,
      MONTHLY: this.langService.dictionary.monthly,
      YEARLY: this.langService.dictionary.yearly
    }
    return !!recurrence ? freq[recurrence] : this.langService.dictionary.notRepeatItself;
  }
  isMidnight(date: Date) {
    return date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0;
  }
  addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
  }
  getDiffMinutes(dateFrom, dateTo) {
    var diffMs = (dateTo - dateFrom);
    return Math.floor( diffMs / 60000);
  }

  arraysEqual(a, b, propertyToCompare = '') {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
  
    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.
  
    for (var i = 0; i < a.length; ++i) {
      if (propertyToCompare === '') if (a[i] !== b[i]) return false;
      else if (a[i][propertyToCompare] !== b[i][propertyToCompare]) return false;
    }
    return true;
  }

  getAcronym(value) {
    var matches = value.match(/\b(\w)/g);
    var acronym = matches.join('');
    return acronym;
  }
  getToHexColour(value) {
    return this.intToARGB(this.hashCode(value));
  }
  intToARGB(i) {
    var hex = ((i >> 24) & 0xFF).toString(16) +
      ((i >> 16) & 0xFF).toString(16) +
      ((i >> 8) & 0xFF).toString(16) +
      (i & 0xFF).toString(16);
    hex += '000000';
    return hex.substring(0, 6);
  }
  hashCode(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  getActivFormattedData(data: any[]) {
    // Uniform the datetime format EEEE dd MMMM yy
    for (const item of data) {
      const time = new Date(item.datetime).toDateString();
      item.format_datetime = time;
    }
    // Group the activities by datetime
    const groupObject = this.groupBy(data, 'format_datetime');

    // convert the object in array
    const groupArray = Object.keys(groupObject).map((key) => {
      return [key, groupObject[key]];
    });

    // Set specific column value for every activity
    for (const item of groupArray) {
      let activityAr: any[] = [];
      activityAr = item[1];

      let eDate: string;
      const today = new Date().toDateString();
      let eObjects = {};
      activityAr.forEach(element => {

        // Set dateFunc field for TIME column
        eDate = new Date(element.datetime).toDateString();
        if (eDate === today) {
          element.dateFunc = this.getTimeFunc(new Date(element.datetime).getTime());
        } else {
          const hh = new Date(element.datetime).getHours().toString();
          let mm = new Date(element.datetime).getMinutes().toString();
          mm = (mm.length === 1) ? ('0' + mm) : mm;
          element.dateFunc = 'Alle ' + hh + ':' + mm;
        }

        // Set icons field for ICONS column
        if (element.type !== 'systemtags' && element.type !== 'security') {
          eObjects = element.objects;
          element.icons = [];
          for (const property in eObjects) {
            if (eObjects.hasOwnProperty(property)) {
              const path: string = eObjects[property];

              if (path.includes('.')) { // If is a file
                const index = path.indexOf('.');
                const extension = path.substring(index + 1, path.length);

                if (extension === 'png' || extension === 'svg' || extension === 'jpg' ||
                  extension === 'gif' || extension === 'tiff' || extension === 'webp' ||
                  extension === 'psd' || extension === 'raw' || extension === 'ai' ||
                  extension === 'ico' || extension === 'jpeg') {
                  element.icons.push('photo');

                } else if (extension === 'docx' || extension === 'doc' || extension === 'txt' ||
                  extension === 'md' || extension === 'odt' || extension === 'rtf' ||
                  extension === 'tex') {
                  element.icons.push('format_align_left');

                } else if (extension === 'xls' || extension === 'xlsx' || extension === 'xlsm' ||
                  extension === 'ods') {
                  element.icons.push('border_all');

                } else if (extension === 'pdf') {
                  element.icons.push('insert_drive_file');

                } else if (extension === 'mp4' || extension === 'avi' || extension === 'flv' ||
                  extension === 'm4v' || extension === 'mov' || extension === 'mpg' ||
                  extension === 'mpeg' || extension === 'rm' || extension === 'swf' ||
                  extension === 'vob' || extension === 'wmv' || extension === '3g2') {
                  element.icons.push('desktop_windows');

                }

              } else { // If is a folder
                element.icons.push('folder');
              }
            }
          }
        }

        // Set profile_pic_url field for PROFILE_PIC column
        if (element.user) {
          element.profile_pic_url = `${globals.endpoint}/setting/info/avatar/getavatar?user=` + element.user + `&size=30`;
        }
      });
    }

    return groupArray;
  }

  groupBy(array: any[], key: string) {
    return array.reduce((result, currentValue) => {
      // If an array already present for key, push it to the array. Else create an array and push the object
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
      return result;
    }, {}); // empty object is the initial value for result object
  }

  getTimeFunc(value: number) {
    const nowDate = Math.trunc(Date.now() / 1000);
    const result = (value.toString().length > 10) ? (nowDate - (value / 1000)) : (nowDate - value);
    let date;
    for (const item of this.objDate) {
      const counter = Math.trunc(result / item.value);
      if (counter > 0) {
        date = counter + ((counter > 1) ?
          this.langService.dictionary[item.plural] :
          this.langService.dictionary[item.singular]);
        break;
      }
    }
    if (!date) { date = this.langService.dictionary.less_minute; }

    return date;
  }


  public getResponseFavorites(array) {
    const dataValue = [];
    const ko = '404';
    const home = this.getPathFromHREF(array);

    if (Array.isArray(array)) {
      for (const item of array) {
        const objValue: any = {};
        // const path = item.href;
        for (const b of item.propstat) {
          if (!b.status.includes(ko)) {
            const child: any = b.prop;
            const typeBE = child.getcontenttype;
            const isFileBE = (child.getcontenttype) ? true : false;
            const href = item.href.replace(home, '');
            const nameBE = this.getNameFavorites(href);
            const type = (isFileBE) ? this.getType(typeBE) : 'folder';
            const extension = (isFileBE) ? this.getExtension(nameBE) : '';
            const image = this.getImage(type, child.mounttype, extension);
            const path = href.replace(/%20/g, ' ');

            objValue.id = child.fileid;
            objValue.name = (isFileBE) ? this.getNameFile(nameBE) : nameBE.replace(/%20/g, ' ');
            objValue.extension = extension;
            objValue.image = image.img;
            objValue.classimage = image.imgclass;
            objValue.path = path;
            objValue.isRow = false;
            objValue.coded = false;
            objValue.file = (isFileBE) ? true : false;
            objValue.event = false;
            objValue.favorite = (child.favorite == 1) ? true : false;
            objValue.hide = false;
            objValue.type = (!Array.isArray(child.mounttype) || child.mounttype != 'shared') ? child.mounttype : type;

            dataValue.push(objValue);
          }
        }
      }

    } else {
      const objValue: any = {};
      // const path = item.href;
      const child: any = array.propstat[0].prop;
      if (!array.propstat[0].status.includes(ko)) {
        const typeBE = child.getcontenttype;
        const isFileBE = (child.getcontenttype) ? true : false;
        const href = array.href.replace(home, '');
        const nameBE = this.getNameFavorites(href);
        const type = (isFileBE) ? this.getType(typeBE) : 'folder';
        const extension = (isFileBE) ? this.getExtension(nameBE) : '';
        const image = this.getImage(type, child.mounttype, extension);
        const path = href.replace(/%20/g, ' ');

        objValue.id = child.fileid;
        objValue.name = (isFileBE) ? this.getNameFile(nameBE) : nameBE.replace(/%20/g, ' ');
        objValue.extension = extension;
        objValue.image = image.img;
        objValue.classimage = image.imgclass;
        objValue.path = path;
        objValue.isRow = false;
        objValue.coded = false;
        objValue.file = (isFileBE) ? true : false;
        objValue.event = false;
        objValue.favorite = (child.favorite == 1) ? true : false;
        objValue.hide = false;
        objValue.type = (!Array.isArray(child.mounttype) || child.mounttype != 'shared') ? child.mounttype : type;

        dataValue.push(objValue);
      }
    }

    return dataValue;
  }

  getPathFromHREF(array) {
    let first;
    if (Array.isArray(array)) {
      for (const i in array) {
        if (!first) {
          first = array[i].href.split('/');
        } else {
          const second = array[i].href.split('/');
          const longer = (second.length > first.length) ? second.length : first.length;
          for (let a = 0; a <= longer; a++) {
            if (first[a] != second[a]) {
              first = first.slice(0, a);
              break;
            }
          }
        }
      }
    } else {
      if (array.href.includes(window.sessionStorage.user)) {
        const index = array.href.indexOf(window.sessionStorage.user) + window.sessionStorage.user.length + 1;
        first = array.href.substring(0, index);
      }
    }

    const result = (Array.isArray(first)) ? (first.join('/') + '/') : first;
    return result;
  }

  getNameFavorites(value) {
    const array = value.split('/');
    return array[array.length - 1];
  }

  getType(value: string) {
    const index = value.indexOf('/');
    const subString = value.substring(0, index);
    return subString;
  }

  getImage(value: string, group, extension) {
    let img; let imgclass;

    if (!Array.isArray(group) && group != 'shared' && group != 'external') {
      img = 'folder_shared';
      imgclass = 'folder';
    } else if (value == 'folder') {
      img = 'folder';
      imgclass = 'folder';
    } else if (this.allData.text.includes(extension)) {
      img = 'format_align_left';
      imgclass = 'text';
    } else if (this.allData.image.includes(extension)) {
      img = 'image';
      imgclass = 'image';
    } else if (this.allData.spredsheet.includes(extension)) {
      img = 'border_all';
      imgclass = 'xlxs';
    } else if (this.allData.video.includes(extension)) {
      img = 'movie_creation';
      imgclass = 'video';
    } else if (this.allData.powerpoint.includes(extension)) {
      img = 'desktop_windows';
      imgclass = 'pptx';
    } else if (this.allData.pdf.includes(extension)) {
      img = 'picture_as_pdf';
      imgclass = 'pdf';
    } else if (this.allData.audio.includes(extension)) {
      img = 'music_note';
      imgclass = 'audio';
    } else if (this.allData.richtext.includes(extension)) {
      img = 'short_text';
      imgclass = 'text';
    } else if (this.allData.compressed.includes(extension)) {
      img = 'zip';
      imgclass = 'zip';
    } else {
      img = 'insert_drive_file';
      imgclass = 'generic';
    }

    const result = {
      img: img,
      imgclass: imgclass,
    };

    return result;
  }

  getNameFile(value: string) {
    const index = value.indexOf('.');
    const subString = value.substring(0, index).replace(/%20/g, ' ');
    return subString;
  }

  getExtension(value: string, includeDot = false) {
    let index = value.indexOf('.');
    if (includeDot) index++;
    let subString = value.substring(index, value.length);

    const test = value.substring(index + 1, value.length);
    if (test.includes('.')) {
      index = test.indexOf('.');
      subString = test.substring(index, test.length);
    }
    return subString;
  }

  getCalendarData(data: any[], today, calendarColor) {
    const dataValue: any[] = [];

    for (const item of data) {
      const eventDate = new Date(item.data.DTSTART.date).getTime();

      if (eventDate > today) {
        const objValue: any = {};

        objValue.id = item.id;
        objValue.uid = item.uid;

        const attendees: any[] = item.data.ATTENDEE;
        if (attendees && attendees.length > 0) {
          for (const elem of attendees) {
            if (elem.USERID !== null) {
              elem.profilePicUrl = `${globals.endpoint}/setting/info/avatar/getavatar?user=` + elem.USERID + `&size=30`;
            } else {
              elem.profilePicUrl = null;
            }
          }
        }
        objValue.attendees = attendees;

        if (item && item.data && item.data.ORGANIZER && item.data.ORGANIZER.EMAIL) {
          objValue.organizerEmail = item.data.ORGANIZER.EMAIL;
        }

        if (item && item.data && item.data.ORGANIZER && item.data.ORGANIZER.CN) {
          objValue.organizerCN = item.data.ORGANIZER.CN;
        }

        if (item && item.data && item.data.ORGANIZER && item.data.ORGANIZER.USERID) {
          objValue.organizerUserId = item.data.ORGANIZER.USERID;
        }

        objValue.summary = item.data.SUMMARY;

        objValue.color = calendarColor ? calendarColor : '#007789';

        // Get event start timestamp
        objValue.startTimestamp = item.data.DTSTART.timestamp;

        // Get event start time
        const startDate: string[] = item.data.DTSTART.date.split(' ');
        const day = new Date(startDate[0]);
        const starttime = startDate[1].split(':');
        objValue.startTime = day.toLocaleDateString() + ' ' + starttime[0] + ':' + starttime[1];

        // Get event end time
        const endDate = item.data.DTEND.date.split(' ');
        const endtime = endDate[1].split(':');
        objValue.endTime = endtime[0] + ':' + endtime[1];

        dataValue.push(objValue);
      }
    }

    return dataValue;
  }

  getFormattedDate(dateString: string) {
    if (dateString) {
      const d = new Date(dateString);
      const dateFormatted = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
      return dateFormatted;
    }
  }

  truncateText(text: string, maxCharacters: number) {
    let result = text;
    if (text.length > maxCharacters) {
      result = text.substring(0, maxCharacters - 3) + '...';
    }
    return result;
  }
  randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  //
  encryptPass(pass, keyString, ivString) {

    // the key and iv should be 32 hex digits each, any hex digits you want, but it needs to be 32 on length each
    var key = CryptoJS.enc.Hex.parse(keyString);
    var iv = CryptoJS.enc.Hex.parse(ivString);

    // encrypt the message
    var encrypted = CryptoJS.AES.encrypt(pass, key, { iv: iv, padding: CryptoJS.pad.ZeroPadding });
    //var passencrypted = encrypted.ciphertext.toString(CryptoJS.enc.Base64);   
    var passencrypted = encrypted.toString();
    // and finally, send this "encrypted" string to your server

    return passencrypted;


  }
}
