import { Injectable } from '@angular/core';
import { Dictionary } from '../dictionary/dictionary';
import { globals } from 'src/config/globals';


@Injectable({
  providedIn: 'root'
})
export class ActivityDataFormatService {

  // all data we need for date functional (dict, dict, timestamp)
  objDate = [
    { singular: 'year_ago', plural: 'years_ago', value: 31536000 },
    { singular: 'month_ago', plural: 'months_ago', value: 2628000 },
    { singular: 'week_ago', plural: 'weeks_ago', value: 604800 },
    { singular: 'day_ago', plural: 'days_ago', value: 86400 },
    { singular: 'hour_ago', plural: 'hours_ago', value: 3600 },
    { singular: 'minute_ago', plural: 'minutes_ago', value: 60 }
  ];

  dict = new Dictionary();

  constructor() { }

  getActivFormattedData(data: any[]) {
    // Get username from description
    for (const item of data){
      let arrayDescr = item.subject.split(' ');
      item.subjectName = (arrayDescr[0].toLowerCase() == 'you')? window.sessionStorage.user : arrayDescr[0];
      item.subjectDescr = item.subject.replace(arrayDescr[0], '');
    }

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
          if (sessionStorage.getItem('user_language') === 'it') {
            element.dateFunc = 'Alle ' + hh + ':' + mm;
          } else {
            element.dateFunc = 'At ' + hh + ':' + mm;
          }

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
                            this.dict.getDictionary(item.plural) :
                            this.dict.getDictionary(item.singular));
            break;
        }
    }
    if (!date) { date = this.dict.getDictionary('less_minute'); }

    return date;
  }

}
