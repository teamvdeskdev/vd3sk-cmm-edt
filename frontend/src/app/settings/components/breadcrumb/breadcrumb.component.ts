import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Dictionary } from '../../../file-sharing/dictionary/dictionary';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit, OnChanges {

  @Input() class: string;
  @Input() movepath;
  @Output() change: EventEmitter<any> = new EventEmitter();
  dict = new Dictionary();
  name = '';
  array = [];
  getTitleHome: string;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    this.getTitleHome = this.getTitlePage();
    this.getNamePath();
  }

  ngOnChanges(changes: SimpleChanges) {
    const activity = changes.movepath;
    if (activity.currentValue != activity.previousValue) {
      this.ngOnInit();
    }
  }

  /** RETURN TO PATH
   * Click on single path folder name
   * Navigate to that folder
   * Also used in dialog for move file
   **/
  returnToPath(value){
    if(!this.class){
      let realname = '';
      let realURL = decodeURIComponent(this.router.url);
      let d = realURL.slice(realURL.indexOf('&d=')+3);
      if(this.array.length>1 && value!=this.array[this.array.length-1]){
        for(let i=0; i<this.array.length;i++){
          if(this.array[i] != value){
            realname = realname +'/'+this.array[i];
          }else{
            realname = realname + ((realname)?'/':'' ) + this.array[i];
            this.router.navigate(['filesharing','folder', this.array[i]], {queryParams: { name: realname, d: d }});
            break;
          }
        }
      }
    }else{
      for(var a=0; a<this.array.length; a++){
        if(this.array[a] == value){
          let newarray = (a==0)? this.array.slice(0, 1) : this.array.slice(0, a);
          let result = (newarray.length>1)? newarray.join('/') : newarray.join();
          let dataresult = {
            result: result,
            navigate: true,
          }
          this.change.emit(dataresult);
          break;
        }
      }
    }
  }

  /** NAVIGATE HOME
   * Click on home path
   * Navigate to home
   * Also used in dialog for move file
   **/
  navigateHome(){
    if(!this.class){
      let realURL = decodeURIComponent(this.router.url);
      let d = realURL.slice(realURL.indexOf('&d=')+3);
      if(d=='delete') this.router.navigate(['filesharing','deleted']);
      else if(d=="all") this.router.navigate(['filesharing','all-files']);
      else if(d=="archives") this.router.navigate(['filesharing','externalarchives']);
      else this.router.navigate(['filesharing','group-folder']);
    }else{
        this.change.emit('');
    }
  }


  /** GET NAME PATH
   * Get path home from url if there is no class else get it from string value
   * Also used in dialog for move file
   **/
  getNamePath(){
    if(!this.class){
      let string = 'folder';
      let oldroute = decodeURIComponent(this.router.url);
      let arrayRoute = oldroute.split('/');
      if(oldroute.includes('/'+string+'/') && !oldroute.includes('-'+string)){
        arrayRoute = arrayRoute.slice(arrayRoute.indexOf(string) + 1);
        for(var i=0; i<arrayRoute.length; i++){
          arrayRoute = (arrayRoute[i].includes('&'))? arrayRoute.slice(i) : arrayRoute;
          if(arrayRoute[i]){
            let toPush = (arrayRoute[i].includes('?'))? arrayRoute[i].slice(0, arrayRoute[i].indexOf('?')) : arrayRoute[i];
            this.array.push(toPush);
          }

        }
      }
    }else{
      if(this.movepath.length>0){
        let array = this.movepath.split('/');
        this.array = [];
        for(var a in array){
          if(array[a].length>0)
            this.array.push(array[a]);
        }
      }else{
        this.array = [];
      }
    }
  }

  /** GET TITLE PAGE
   * Get path home from url if there is no class
   * Also used in dialog for move file
   **/
  getTitlePage(){
    let result;
    if(!this.class){
      let realURL = decodeURIComponent(this.router.url);
      if(realURL.includes('group-folder') || !realURL.includes('/folder/')){
        let arrayUrl = this.router.url.split('/');
        for(let i=0; i<=arrayUrl.length; i++){
          if(arrayUrl[i] == 'filesharing' && (arrayUrl[i+1]!=='activities' && arrayUrl[i+1]!=='settings')){
            result = arrayUrl[i+1];
            break;
          } else if(arrayUrl[i] == 'filesharing' && arrayUrl[i+1] === 'activities') {
            result = arrayUrl[i+1] + '_' + arrayUrl[i+2];
            break;
          } else if(arrayUrl[i] == 'filesharing' && arrayUrl[i+1] === 'settings'){
            result = arrayUrl[i+1] + '_' + arrayUrl[i+2];
            break;
          }
        }
      }else{
        let d = realURL.slice(realURL.indexOf('&d=')+3);
        result = (d=='all')? 'all-files': ((d=='delete')? 'deleted' : ((d=="group")? 'group-folder' : 'externalarchives'));
      }
    }else{
      result = 'all-files';
    }

    return this.dict.getDictionary(result);
  }

}

